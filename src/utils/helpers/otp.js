import bcrypt from "bcryptjs"
import { OtpModel } from "../../model/otpModel.js";
import { findOtp, findUser } from "../../workers/dbWork.js";

export const issueOtp = async (userId, email) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

  const saltRounds = +process.env.SALT_WORKER;

  const hashedOTP = await bcrypt.hash(otp, saltRounds);
  await OtpModel.create({
    userId,
    email,
    otp: hashedOTP,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600,
  });
  return {
    userOtp: otp,
    timeLeft: `1 hour`,
  };
};

export const verifyOtp = async (otpId, email, otp, keepAlive = false) => {
  const otpDetails= await findOtp(otpId,email)
  if(!otpDetails){return false}
  const validOtp = await bcrypt.compare(otp, otpDetails.otp);
  if (!validOtp) return false;
  // To prevent the otp from being used twice, reset the otp.
  // if (!keepAlive) await issueOtp(email, userId);
  return true;
};
