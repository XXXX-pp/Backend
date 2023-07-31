import { otpMessage } from "../mail/otpEmailMessage.js";
import { sendEmail } from "../mail/sendOtpMail.js";
import { issueOtp, verifyOtp } from "../workers/otpWork.js";
import { updateUserStatus,deleteOtp } from "../workers/dbWork.js";
import { generateJwtToken } from "../utils/utilities.js";

//send otp to user email
export const sendUserOtp = async (userId,email) => {
  try {
    if (!userId || !email) {
      return ({
        status: false,
        message: `User details not found`,
      });
    };
    
    //generate a new otp
    const otp = await issueOtp(userId, email);
    const message = otpMessage(otp.userOtp, otp.timeLeft);

    //send mail with otp details
    await sendEmail(email,message);
    
    return ({
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

//verify otp details
export const verifyUserOtp = async (req, res) => {
  try {
    const { userId, email, otp } = req.body;
    if (!userId || !otp) {
      throw Error("Empty otp details are not allowed");
    }

    const validOtp = await verifyOtp(userId, email, otp);
    
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
    
    //send jwt token togin user if otp is valid
    const token = await generateJwtToken(user)
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
