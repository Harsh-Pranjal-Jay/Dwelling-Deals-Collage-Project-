import nodemailer from 'nodemailer';
// import dotenv from 'dotenv';

// dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use your email service provider
  auth: {
    user:"harshpatel200305@gmail.com",
    pass: "vthd smdo mhhj cxxq",
  }
});

export const sendMail = async (to, subject, text) => {
  console.log("Sending mail to:", to);
  try {
    const res = await transporter.sendMail({
      from:"harshpatel200305@gmail.com",
      to,
      subject,
      text
    });
    console.log("Mail sent:");
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
