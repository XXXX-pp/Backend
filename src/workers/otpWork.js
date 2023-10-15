import bcrypt from "bcryptjs"
import { findOtp,saveOtp,findUser } from "../workers/dbWork.js";


export const issueOtp = async (userId, email, username, password) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const saltRounds = +process.env.SALT_WORKER;
  const hashedOTP = await bcrypt.hash(otp, saltRounds);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const otpSaved = await saveOtp(userId, email, hashedOTP, username.toLowerCase(), hashedPassword)
     
  return {
    userOtp: otp,
    timeLeft: `2 minutes`
  };
};

export const verifyOtp = async (email, otp) => {
  const userVerified= await findUser("",email)
  if (userVerified.isVerified) return {status:true, isVerified:userVerified.isVerified}
  const otpDetails= await findOtp(email)

  if(!otpDetails) return {status:false, otpDetails:false}

  const validOtp = await bcrypt.compare(otp, otpDetails.otp)
  if (!validOtp) return {status:false, validOtp:false}
  if (validOtp) return {status:true, validOtp:true}
};
