import { Schema, model } from "mongoose";

const otpSchema = new Schema({
  userId: { type: String, required: true, ref: "User" },
  email: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

export const OtpModel = model("Otp", otpSchema);
