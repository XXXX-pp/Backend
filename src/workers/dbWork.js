import { UserModel } from "../model/userModel.js";
import { OtpModel } from "../model/otpModel.js";

export const saveUser = async(username,email,phonenumber,hashedPassword)=>{
    const user = await UserModel.create({
        email,
        username,
        phonenumber,
        password: hashedPassword,
    });
    return user
}

export const findUser = async(username,email,phonenumber,userId) =>{
    const user = await UserModel.findOne(
        { $or: [{ email }, { username }, { phonenumber },{ userId }] }
    ).lean();
    return user
}

export const updateUserStatus = async(userId)=>{
    const user = await UserModel.updateOne(
        { _id: userId },
        { isVerified: true },
        { new: true }
    );
    return user
}

export const saveOtp = async(userId,email,hashedOTP)=>{
    await OtpModel.create({
        userId,
        email,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600,
    });
}

export const findOtp = async(userId,email) =>{
    const userOtp = await OtpModel.findOne(
        { $or: [{ email },{userId}] }
    ).lean();
    return userOtp
}
export const deleteOtp = async(email)=>{
    await OtpModel.deleteOne({ email })
}




