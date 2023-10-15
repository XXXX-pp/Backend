import { otpMessage } from "../../mail/otpEmailMessage.js";
import { sendEmail } from "../../mail/sendOtpMail.js";
import { issueOtp, verifyOtp } from "../../workers/otpWork.js";
import { updateUserStatus,deleteOtp } from "../../workers/dbWork.js";
import { generateJwtToken } from "../../utils/utilities.js";
import { findUser} from "../../workers/dbWork.js"



//send otp to user email
export const sendUserOtp = async (userId,email,username,password) => {
  try {
        
    //generate a new otp
    const otp = await issueOtp(userId, email, username, password);
    const message = otpMessage(otp.userOtp, otp.timeLeft);

    //send mail with otp details
    const emailStatus = await sendEmail(email,message);
    if (emailStatus){
      setTimeout( deleteOtp,120000,email)
    }
    if (emailStatus.accepted) return ({
      status: true,
    })

    if (emailStatus.rejected) return ({
      status:false,
    })
  } catch (error) {
    return error
  }
}

//verify otp details
export const verifyUserOtp = async (req, res) => {
  try {
    const {email,otp,userId} = req.body

    //check for request body
    if (!email || !otp || !userId) return res.status(404).json({
      status: false,
      message:'Details cannot be empty'
    })  
    //Verify user otp
    const validOtp = await verifyOtp(email, otp);
    
    if (!validOtp) return res.status(400).json({
      status: 400,
      message: "Otp details incorrect",
      })
  
    //update user status if otp is valid
    const user = await updateUserStatus(userId)
    if (user){
      await deleteOtp(email)
      const token = await generateJwtToken(user)
      res.status(200).json({
        status: true,
        message: 'User verified',
        data: user,
        token
      })
    } 
  } catch (error) {
    // delete user from database
    return res.status(500).json({status: false});
  }
}

export const resendOtp = async (req, res) => {
  try {
    const {email,userId} = req.body

    //check for request body
    if (!email || !userId) return res.status(404).json({
      status: 404,
      message:'Details cannot be empty'
    })

    const user = await findUser(userId,email)

    if(user){
      await deleteOtp(email)
      const resendStatus = await sendUserOtp(user._id,user.email,user.username,user.password)

      if(resendStatus.status === true) return res.status(201).json({
        status: 201,
        userId: user._id,
        email: user.email,
        message:'Otp sent successfully'
      })

      if(resendStatus.status === false) return res.status(400).json({
        status: 400,
        message:'Failed to send otp, check email'
      })
    } 
  } catch (error) {  
    console.log(error)
    res.status(500).json({
      status:500,
      message:'Server error, please try again later, '+ error.message
    })
  }
}