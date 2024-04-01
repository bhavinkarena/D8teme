import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config(); // Load environment variables from .env file

const sender = process.env.EMAIL_SENDER;
const password = process.env.EMAIL_PASSWORD;

const sendEmail = async (recipient,otp) => {
  if (recipient.includes('string')) {
    console.log('This was a test user.');
    return;
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: sender,
      pass: password,
    },
  });

  const mailOptions = {
    from: sender,
    to: recipient,
    subject: 'Please Verify Your D8teMe Profile!',
    html: `<p>Your One-Time Password (OTP) for account verification is:</p>
           <h2>${otp}</h2>
           <p>Please use this OTP to complete the registration process.</p>
           <p>If you did not initiate this request, please ignore this email.</p>
           <br>
           <p>Best regards,<br>D8teme Team</p>`,
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    console.log('Message sent!');
    return otp;
    
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

// export const sendLink = async (recipient, validationToken) => {
//   if (recipient.includes('string')) {
//     console.log('This was a test user.');
//     return;
//   }

//   const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//       user: sender,
//       pass: password,
//     },
//   });

//   const mailOptions = {
//     from: sender,
//     to: recipient,
//     subject: 'Please Verify Your D8teMe Profile!',
//     text: `Please click the following link to validate the email you used to create your D8teMe Profile: http://localhost:5050/api/v1/user/validateemail?user_guid=${validationToken}`,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log('Email sent: ' + info.response);
//     console.log('Message sent!');
    
//   } catch (error) {
//     console.error('Error sending email:', error);
//   }
// };

export default sendEmail;
