const otpGenerator = require('otp-generator');

const generateOTP = () => {
  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
  return otp;
};

module.exports = generateOTP;
