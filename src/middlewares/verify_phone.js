import twilio from "twilio"
// Twilio credentials
const accountSid = process.env.accountSid
const authToken = process.env.authToken;
const twilioClient = twilio(accountSid, authToken);
const sendSMS = async (phoneNumber, otp) => {
  try {
    await twilioClient.messages.create({
      body: `Your OTP is: ${otp} Jati reje`,
      from: process.env.twilioPhoneNumber,
      to: phoneNumber,
    });
    console.log(`SMS sent to ${phoneNumber} with OTP: ${otp}`);
  } catch (error) {
    console.error('Error sending SMS via Twilio:', error);
    return res.status(500).json(new ApiError(500, null, 'Error sending SMS'));
  }
};
export default sendSMS;