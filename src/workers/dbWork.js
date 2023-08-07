import { UserModel } from "../model/userModel.js";
import { OtpModel } from "../model/otpModel.js";
import { PostModel } from "../model/postModel.js";

export const saveUser = async(username,email,hashedPassword,posts,postYouLiked,postsYouSaved)=>{
    const user = await UserModel.create({
        email,
        username,
        password: hashedPassword,
        posts,
        postYouLiked,
        postsYouSaved,
    });
    return user
}

export const findUser = async(username,email,userId) =>{
    const user = await UserModel.findOne(
        { $or: [{ email }, { username },{ userId }] }
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

export const updateUserPosts = async(user,postId)=>{
    const userPostStatus = await UserModel.updateOne(
        { username: user },
        { $push: {posts: postId} },
        { new: true }
    );
    return userPostStatus
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

export const createNewPost = async(user, description,firstImage,secondImage,likes,postId) => {
    const post = await PostModel.create({
        user,
        description,
        firstImage:firstImage,
        secondImage:secondImage,
        likes,
        postId
    });
    return post
}




