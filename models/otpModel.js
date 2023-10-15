const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const optSchema = mongoose.Schema({
  contact_number: {
    type: String,
    unique: true,
  },
  otp: {
    type: String,
    maxLength: [4, 'Invalid OTP: max-length exceeded'],
  },
  isNewUser: {
    type: Boolean,
  },
  expiresAt: {
    type: Date,
    select: false,
  },
});

optSchema.pre('save', async function (next) {
  if (!this.isModified('otp')) return next();
  this.otp = await bcrypt.hash(this.otp, 12);
  next();
});

const OTP = mongoose.model('OTP', optSchema);

module.exports = OTP;
