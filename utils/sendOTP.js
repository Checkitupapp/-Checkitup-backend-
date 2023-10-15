const twilio = require('twilio');

const sendOTP = async (otp, contact_number, next) => {
  //send otp
  const accountSIDTwilio = process.env.TWILIO_SID;
  const authTokenTwilio = process.env.TWILIO_AUTH;
  const twilioPH = process.env.TWILIO_PH;
  const twilioClient = new twilio(accountSIDTwilio, authTokenTwilio);
  const twilio_msg = await twilioClient.messages.create({
    body: `[CheckItUp] your OTP code is: ${otp}. (expires in ${process.env.OTP_EXPIRESIN} minutes) `,
    to: contact_number,
    from: twilioPH,
  });
};

module.exports = sendOTP;
