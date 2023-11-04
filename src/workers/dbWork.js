import { UserModel } from "../model/userModel.js";
import { OtpModel } from "../model/otpModel.js";
import { PostModel } from "../model/postModel.js";
import { CommentModel } from "../model/commentModel.js";

export const saveUser = async(username,email,hashedPassword,posts,postYouLiked,postsYouSaved,totalNoOfLikes)=>{
    const user = await UserModel.create({
        email,
        username,
        password: hashedPassword,
        posts,
        postYouLiked,
        postsYouSaved,
        totalNoOfLikes
    });
    return user
}

export const findUser = async(username,email) =>{
    const user = await UserModel.findOne(
        { $or: [{ username:username },{ email:email }] }
    ).lean();
    return user
}

export const updateUserStatus = async (userId) => {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isVerified: true },
      { new: true }
    ).select('_id username');
  
    return user;
  };

export const updateUserPosts = async(user,postId)=>{
    const userPostStatus = await UserModel.updateOne(
        { username: user },
        { $push: {posts: postId} },
        { new: true }
    );
    return userPostStatus
}

export const saveOtp = async(userId,email,hashedOTP,username,hashedPassword)=>{
    await OtpModel.create({
        userId,
        email,
        username,
        password: hashedPassword,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600,
    });
}

export const findOtp = async(email) =>{
    const otpHolder = await OtpModel.findOne({ email: email })
    return otpHolder
}
export const deleteOtp = async(email)=>{
    await OtpModel.deleteOne({ email })
}

export const createNewPost = async(user, description,firstImage,secondImage,postId) => {
    const likes = (firstImage.likes || 0) + (secondImage.likes || 0);
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

export const createNewCommentSection = async (postId, comments) => {
    const comment = await CommentModel.create({
        postId,
        comments
    })
    return comment
}




