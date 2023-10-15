const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const OTP = require('../models/otpModel');
const AppError = require('../utils/appError');
const sendOTP = require('../utils/sendOTP');
const generateOTP = require('../utils/generateOTP');

//helper functions

exports.createUser = async (req, res, next) => {
  // const { name, dob, role, gender } = req.body;
  try {
    // create user
    const newUser = await User.create(req.body);

    //if sucess: send
    res.status(200).send({
      status: 'success',
      message: 'user created successfully',
      data: {
        newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
exports.generateAndSendOTP = async (req, res, next) => {
  try {
    //TODO: implement rate limit so users can access otp at specific rate/unit time
    const contact_number = req.params.contact_number;
    let isNewUser = false;
    // generate otp
    const otp = generateOTP();
    //set OTP Data
    const expiresAt = new Date();
    expiresAt.setMinutes(
      expiresAt.getMinutes() + process.env.OTP_EXPIRESIN * 1
    );
    let otpData = { contact_number, otp: otp, isNewUser, expiresAt };

    // check if is new user
    const isUserExists = await User.exists({ contact_number });
    if (!isUserExists) {
      otpData.isNewUser = true;
    }
    //delete current otp if any
    const isOTPExists = await OTP.exists({ contact_number });
    if (isOTPExists !== null) {
      await OTP.findByIdAndDelete(isOTPExists._id);
    }
    // store new otp
    const newOTP = new OTP(otpData);
    await newOTP.save();
    // const newOTP = await OTP.create(otpData);
    // send otp to phone number
    // -------------------------------Turn On OTP---------------------------------
    await sendOTP(otp, contact_number, next);

    // send OTP success
    if (process.env.NODE_ENV === 'production') delete otpData.otp;
    res.status(200).send({
      status: 'success',
      message: 'OPT sent successfully',
      data: { otpData },
    });
  } catch (error) {
    //send OTP fail
    next(error);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { contact_number, otp } = req.body;

    //verify opt for given number
    const currentTime = new Date();
    const currentOTP = await OTP.findOne({
      contact_number,
      expiresAt: { $gte: currentTime },
    });
    if (!currentOTP) {
      return next(new AppError(`OTP '${otp}' Expired or Invalid`, 401));
    }
    const userOTP = currentOTP.otp;
    const correctOTP = await bcrypt.compare(otp, userOTP);
    if (!correctOTP) {
      return next(new AppError(`OTP '${otp}' Expired or Invalid`, 401));
    }
    //sign token
    const token = await promisify(jwt.sign)(
      { id: currentOTP._id, contact_number: contact_number },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRESIN }
    );
    await OTP.findByIdAndDelete(currentOTP._id);
    //get user if not a new user

    let data = { isNewUser: currentOTP.isNewUser, token };
    // send user object in responce
    if (!currentOTP.isNewUser) {
      const user = await User.findOne({ contact_number: contact_number });
      data.user = user;
    }
    res.status(200).send({
      status: 'success',
      message: 'OTP verified successfully.',
      data: { data },
    });
  } catch (error) {
    next(error);
  }
};
exports.createAvatar = async (req, res, next) => {
  try {
    const { gender, avatar } = req.body;
    // create user avatar
    const newUser = await User.findByIdAndUpdate(
      req.user.id,
      { gender: gender, avatar: avatar },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!newUser) return next(new AppError('user not found', 401));
    // if success: send
    res.status(200).send({
      status: 'success',
      data: { newUser },
    });
  } catch (error) {
    //if fail: send
    next(error);
  }
};
