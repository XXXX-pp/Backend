import jwt from "jsonwebtoken";

import { UserModel } from "../model/userModel.js";

import { otpMessage } from "../mail/otpMail.js";
import { sendEmail } from "../mail/sendMail.js";
import { OtpModel } from "../model/otpModel.js";
import { issueOtp, verifyOtp } from "../utils/helpers/otp.js";

export const sendUserOtp = async (req, res) => {
  try {
    const { userId, email } = req.body;
    
    if (!userId || !email) {
        return res.status(408).json({
            status: false,
            message: `User details not found`,
          });
    };
    
    const otp = await issueOtp(userId, email);
    const message = otpMessage(otp.userOtp, otp.timeLeft);

    await sendEmail(email,message);
    
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
    const { otpId, email, otp } = req.body;
    if (!otpId || !otp) {
      throw Error("Empty otp details are not allowed");
    }

    const validOtp = await verifyOtp(otpId, email, otp);
    console.log(validOtp)

    if (!validOtp){
    return(
    res.status(400).json({
      status: false,
      message: "Otp incorrect",
      })
    )}


    const user = await UserModel.updateOne(
      { email: email },
      { isVerified: true },
      { new: true }
    );

    await OtpModel.deleteOne({ email});

    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

    res.status(200).json({
      status: true,
      message: "user verified successfully",
      data: user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: `internal server error`,
    });
  }
};
