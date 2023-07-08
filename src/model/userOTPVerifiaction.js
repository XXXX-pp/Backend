import { Schema, model } from 'mongoose'

const userOTPVerificationSchema = new Schema({
    userId: String,
    otp: String,
    createdAt: Date,
    expiresAt: Date,
})

export const UserOTPVerification = model("UserOTPVerification", userOTPVerificationSchema);