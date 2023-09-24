import bcrypt from "bcryptjs"
import { findOtp,saveOtp } from "../workers/dbWork.js";

export const issueOtp = async (userId, email, username, password) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const saltRounds = +process.env.SALT_WORKER;
  console.log('otp', otp)
  const hashedOTP = await bcrypt.hash(otp, saltRounds);
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await saveOtp(userId, email, hashedOTP, username, hashedPassword)
  return {
    userOtp: otp,
    timeLeft: `1 hour`,
  };
};

export const verifyOtp = async (email, otp, userId, keepAlive = false) => {
  const otpDetails= await findOtp(email)
  if(!otpDetails){return false}
  const validOtp = await bcrypt.compare(otp, otpDetails.otp)
  if (!validOtp) return false;
  // To prevent the otp from being used twice, reset the otp.
  // if (!keepAlive) await issueOtp(email, userId);
  return true;
};
