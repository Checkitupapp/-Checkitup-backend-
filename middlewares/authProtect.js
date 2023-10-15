const User = require('../models/userModel');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
exports.authProtect = async (req, res, next) => {
  try {
    //check if token exists
    let token;
    if (req.headers.auth_token) {
      token = req.headers.auth_token;
    }
    if (!token)
      return next(new AppError('un-authorized, please login to continue', 401));
    // decode JWT
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // check if user for this token
    const currentUser = await User.findOne({
      contact_number: decoded.contact_number,
    });
    if (!currentUser)
      return next(new AppError('Unauthorized, user does not exist', 401));
    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError(error.message.replace('jwt', 'auth token'), 401));
  }
};
