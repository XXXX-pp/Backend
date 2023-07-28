import { UserModel } from "../model/userModel.js";
import { OtpModel } from "../model/otpModel.js";


export const findUser = async(username,email,phonenumber,userId) =>{
    const user = await UserModel.findOne(
        { $or: [{ email }, { username }, { phonenumber },{ userId }] }
    ).lean();
    return user
}

export const findOtp = async(otpId,email) =>{
    const userOtp = await OtpModel.findOne(
        { $or: [{ email },{otpId}] }
    ).lean();
    return userOtp
}


export const saveUser = async(username,email,phonenumber,hashedPassword)=>{
    await UserModel.create({
        email,
        username,
        phonenumber,
        password: hashedPassword,
    });
}

