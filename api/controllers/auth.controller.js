import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import errorHandler from "../utils/error.js";
import jwt from "jsonwebtoken";
import { passwordGenarator, usernameGenarator } from "../utils/helper.js";
import { sendMail } from "../utils/sendMailer.js";

const OTP_EXPIRY_TIME = 5* 60 * 1000;

// Handle signup route
export const singup = async (req, res, next) => {
  const { username, email, password, role } = req.body;
  
  // Validate role
  if (role && !['buyer', 'seller'].includes(role)) {
    return next(errorHandler(400, "Invalid role. Must be either 'buyer' or 'seller'"));
  }

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = new User({ 
    username, 
    email, 
    password: hashedPassword,
    role: role || 'buyer' // Default to buyer if role not specified
  });

  try {
    await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        username: newUser.username,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// Handle signin route
export const signin = async (req, res, next) => {
  const { email, userPassword } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "Wrong Credentials!"));
    const isValidPassword = bcrypt.compareSync(userPassword, validUser.password);
    if (!isValidPassword) return next(errorHandler(401, "Wrong Credentials!"));

    const { password, ...rest } = validUser._doc;
    const token = jwt.sign({ id: validUser._id }, 'edlmY+rfbah/THFfLucEAaboPH3aoKt3VGGSYm0UZZk=', { expiresIn: "24h" });
    
    res
      .cookie("access_token", token, { 
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Handle signout
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");
    res.status(200).json("User signed out successfully!");
  } catch (error) {
    next(error);
  }
};

// Handle forgot password
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new Error(404, 'User not found'));
    }

    const otp = Math.floor(100000 + Math.random() * 900000);
    const expiresAt = Date.now() + OTP_EXPIRY_TIME;

    user.otp = otp;
    user.otpExpiresAt = expiresAt;
    await user.save();

    const subject = 'Password Reset OTP';
    const text = `Your OTP for password reset is ${otp}. It will expire in 5 minutes.`;

    await sendMail(email, subject, text);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    next(error);
  }
};
// export const forgotPassword = async (req, res, next) => {
//   console.log("Forgot password request received");
//   const { email } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) {
//       return Error(404, 'User not found');
//     }  

//     const otp = Math.floor(100000 + Math.random() * 900000);
//     const expiresAt = Date.now() + OTP_EXPIRY_TIME;

//     user.otp = otp;
//     user.otpExpiresAt = expiresAt;
//     await user.save();

//     const subject = 'Password Reset OTP';
//     const text = `Your OTP for password reset is ${otp}.`;

//     res = await sendMail(email, subject, text);
//     console.log("Email sent successfully:", res);
//     return res;
//   } catch (error) {
//     next(error);
//   }
// };






// password change

export const verifyOtp = async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Fetch the user based on the email
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }
    if(user.otp!=otp){
      return next(errorHandler(404,'Invalid Otp'))
    }
    // Hash the new password
    const hashedPassword = bcrypt.hashSync(newPassword, 8);
    user.password = hashedPassword;
    user.otp = null; // Reset OTP
    user.otpExpiresAt = null; // Reset OTP expiration
    await user.save();
    
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error occurred:', error);
    next(error);
  }
};


