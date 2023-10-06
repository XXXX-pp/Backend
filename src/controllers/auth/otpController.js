import { otpMessage } from "../../mail/otpEmailMessage.js";
import { sendEmail } from "../../mail/sendOtpMail.js";
import { issueOtp, verifyOtp } from "../../workers/otpWork.js";
import { updateUserStatus,deleteOtp } from "../../workers/dbWork.js";
import { generateJwtToken } from "../../utils/utilities.js";
import jwt from "jsonwebtoken";

//send otp to user email
export const sendUserOtp = async (userId,email,username,password) => {
  try {
    if (!userId || !email || !username || !password) {
      return ({
        status: false,
        message: `User details not found`,
      });
    };
    
    //generate a new otp
    const otp = await issueOtp(userId, email, username, password);
    const message = otpMessage(otp.userOtp, otp.timeLeft);
    //send mail with otp details
    await sendEmail(email,message);
    
    return ({
      status: true,
      message: "otp sent successfully",
      data: null
    });
  } catch (error) {
    return ({
      status: false,
      message: `internal server error`,
    });
  }
};

//verify otp details
export const verifyUserOtp = async (req, res) => {
  try {
    const {email, otp, userId} = req.body
    if (!email || !otp || !userId) {
      throw Error("Empty otp details are not allowed");
    }
    const validOtp = await verifyOtp(email, otp);
    
    if (!validOtp){
    return(
    res.status(400).json({
      status: false,
      message: "Otp incorrect",
      })
    )}
    
    //update user status if otp is valid
    const user = await updateUserStatus(userId) 
    await deleteOtp(email)
    const token = await generateJwtToken(user)
    res.json({
      status: true,
      data: user,
      token
    })
  } catch (error) {
    console.log(error)
    // delete user from database
    return res.status(500).json({status: false});
  }
};
