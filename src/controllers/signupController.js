import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {findUser} from "../workers/dbWork.js"

import { UserModel } from "../model/userModel.js";
import { otpMessage } from "../mail/otpMail.js";
import { sendEmail } from "../mail/sendMail.js";
import { OtpModel } from "../model/otpModel.js";
import { issueOtp, verifyOtp } from "../utils/helpers/otp.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE;

export const createUser = async (req, res) => {
  try {
    // Extracting the username, mobilenumber, and password from the request body
    const { username, phonenumber, password, email } = req.body;
    const userExists = await findUser(username,phonenumber,email)
  
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User with details already exists",
        data: null,
      });
    }

    const saltRounds = +process.env.SALT_WORKER;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // If user does not exist create a new user with the provided username, mobilenumber, and password
    if (!userExists){
      const user = await UserModel.create({
        email,
        username,
        phonenumber,
        password: hashedPassword,
      });

      //
      // const otp = await issueOtp(email, user._id);
      // const html = otpMessage(otp.emailOtp, otp.timeLeft);
      // const subject = "Verify Your Email";
      // const to = user.email;
      // await sendEmail(html, subject, to);
      
      // If user creation is successful, send a JSON response with the user's information
      return res.status(201).json({
        success: true,
        message: `user created successfully`,
        data: user,
      });
    };
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message:`internal server error` });
  }
};

export const sendUserOtp = async (req, res) => {
  try {
    const { userId, email } = req.body;
    if (!userId || !email) {
      throw Error("Empty otp details are not allowed");
    };

    const otp = await issueOtp(userId, email);
    const html = otpMessage(otp.emailOtp, otp.timeLeft);
    const subject = "OTP Authorization";
    const to = user.email;
    await sendEmail(html, subject, to);
    res.status(200).json({
      status: true,
      message: "otp sent successfully",
      data: null
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `internal server error`,
    });
  }
};

export const verifyUserOtp = async (req, res) => {
  try {
    const { userId, email, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed");
    }

    const validOtp = await verifyOtp(userId, email, otp);
    if (!validOtp)
      return {
        success: false,
        message: "otp expired or incorrect",
        data: null,
      };

    const user = await UserModel.updateOne(
      { _id: userId },
      { isVerified: true },
      { new: true }
    );

    await OtpModel.deleteMany({ userId });
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRE });

    res.status(200).json({
      status: true,
      message: "user verified successfully",
      data: user,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: `internal server error`,
    });
  }
};
