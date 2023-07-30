import bcrypt from "bcryptjs"
import { findOtp,saveOtp } from "../workers/dbWork.js";

export const issueOtp = async (userId, email) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const saltRounds = +process.env.SALT_WORKER;

  const hashedOTP = await bcrypt.hash(otp, saltRounds);
  await saveOtp(userId, email, hashedOTP)
  return {
    userOtp: otp,
    timeLeft: `1 hour`,
  };
};

export const verifyOtp = async (userId, email, otp, keepAlive = false) => {
  const otpDetails= await findOtp(userId,email)
  if(!otpDetails){return false}
  const validOtp = await bcrypt.compare(otp, otpDetails.otp);
  if (!validOtp) return false;
  // To prevent the otp from being used twice, reset the otp.
  // if (!keepAlive) await issueOtp(email, userId);
  return true;
};
