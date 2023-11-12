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

export const findUser = async(username,email,id) =>{
    const user = await UserModel.findOne(
        { $or: [{ username:username },{ email:email },{_id:id}] }
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

export const updateUserPosts = async(username,postId)=>{
    const userPostStatus = await UserModel.updateOne(
        { username },
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
export const getPost = async(postId)=>{
  const posts = await PostModel.find({}).maxTimeMS(30000)

  async function byLikes(){
    const postsById = await PostModel
    .find()
    .sort({ likes: -1 }) 
    .limit(5);

    return postsById
  }

  async function byId(postId){
    const postsById = await PostModel.findOne({postId:postId})

    return postsById
  }
  return {posts,byLikes:await byLikes(),byId:await byId(postId)}
  
}

export const createNewCommentSection = async (postId, comments) => {
    const comment = await CommentModel.create({
        postId,
        comments
    })
    return comment
}

export const updatePostComment = async (comment,commentId)=>{
  const result = await CommentModel.updateOne(
    { postId: comment.postId },
    {
      $push: {
        comments: { username: comment.username, comment: comment.comment, commentId: commentId },
      },
    }
  )
}

export const getPostComments=async(postId)=>{
  const comment = await CommentModel.findOne({ postId }).maxTimeMS(30000);
  return comment
}


