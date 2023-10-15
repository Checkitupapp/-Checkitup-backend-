const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
  contact_number: {
    type: String,
    required: [true, 'user contact_number is required'],
    unique: true,
    maxLength: 15,
    validate: [validator.isMobilePhone, 'Please enter a valid Mobile Number'],
  },
  gender: {
    type: String,
    required: [true, 'user gender is required'],
    maxLength: 1,
    lowercase: true,
  },
  name: {
    type: String,
    required: [true, 'user name is required'],
    trim: true,
    maxLength: 30,
    minLength: 4,
  },
  dob: {
    type: Date,
    required: [true, 'user dob is required'],
  },
  role: {
    type: String,
    required: [true, 'a user role is required'],
    lowercase: true,
  },
  avatar: {
    type: Object,
    default: { hat: 1, hair: 1, shirt: 1, pant: 1 },
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  followers: {
    type: Number,
    default: 0,
  },
  following: {
    type: Number,
    default: 0,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
