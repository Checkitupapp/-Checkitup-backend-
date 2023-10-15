const User = require('../models/userModel');
const AppError = require('../utils/appError');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).send({
      status: 'success',
      data: { users: users },
    });
  } catch (error) {
    next(error);
  }
};
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    //if no user with that id
    if (!user)
      return next(new AppError('User with that ID does not exist.', 404));
    res.status(200).send({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
exports.updateUserById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    //if no user with that id
    if (!user)
      return next(new AppError('User with that ID does not exist.', 404));
    res.status(200).send({
      status: 'success',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
exports.deleteUserById = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    //if no user with that id
    if (!user)
      return next(new AppError('User with that ID does not exist.', 404));
    res.status(204).send({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
};
// ------------------------xxx--------------------
