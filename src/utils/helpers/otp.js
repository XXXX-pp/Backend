import bcrypt from "bcryptjs"
import { OtpModel } from "../../model/otpModel.js";

export const issueOtp = async (email, userId) => {
  const otp = random.int(100000, 1000000);
  const hashedOTP = await bcrypt.hash(otp, saltRounds);
  await OtpModel.create({
    userId,
    email,
    otp: hashedOTP,
    createdAt: Date.now(),
    expiresAt: Date.now() + 3600,
  });
  return {
    emailOtp: otp.toString(),
    timeLeft: `1 hour`,
  };
};

export const verifyOtp = async (userId, email, otp, keepAlive = false) => {
  const user = await OtpModel.findOne(
    { $or: [{ email }, { userId }] },
    { email, userId }
  ).lean();
  const validOtp = await bcrypt.compare(otp, user.otp);
  if (validOtp !== otp) return false;
  // To prevent the otp from being used twice, reset the otp.
  // if (!keepAlive) await issueOtp(email, userId);
  return true;
};
