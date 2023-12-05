
import { CommentModel } from "../../model/commentModel.js";
import { PostModel } from "../../model/postModel.js";
import { UserModel } from "../../model/userModel.js";
import { findUser} from "../../workers/dbWork.js";

export const deleteUserAccount = async (req, res) => {
  try {
    // const token = req.header('Authorization').split(' ')[1];
    // const secretKey = process.env.JWT_SECRET;
    // const decodedData = decodeJwt(token, secretKey);
    const {email} = req.body

    const user = await findUser('',email,)
    console.log(user._id)

    
    if (user){
    const postArray = user.posts
    const postLiked = user.postYouLiked
    
    postArray.map(async (post)=>{
      await CommentModel.deleteMany({postId:post})  
    })


    postLiked.map(async (post)=>{
      console.log(post)
      const likedPost = await PostModel.findById({_id:post.postId})
      console.log(likedPost)

      const first = likedPost.firstImage.likedBy
      const second = likedPost.secondImage.likedBy

      first.map(async(index)=>{
        if(index == user._id){
          console.log('yes first')
         await PostModel.findByIdAndUpdate({ _id:post.postId}, {$inc: {'firstImage.likes': -1}})    
        }
        await PostModel.findByIdAndUpdate({ _id:post.postId}, {$pull: {'firstImage.likedBy': user._id.toString()}})    
      })

      second.map(async(index)=>{
        if(index == user._id){
          await PostModel.findByIdAndUpdate({ _id:post.postId}, {$inc: {'secondImage.likes': -1}})    
          console.log('yes second')
        }
        await PostModel.findByIdAndUpdate({ _id:post.postId}, {$pull: {'secondImage.likedBy': user._id.toString()}})    
      })

      await PostModel.findByIdAndUpdate({ _id:post.postId}, {$inc: {likes: -1}})    
    })

    postArray.map( async (post)=>{
      await PostModel.deleteOne({postId:post})  
    })

    const status = await UserModel.deleteOne({email})
   }
   return res.status(201).json({status:201})

  } catch (error) {
    return res.status(500).json({ message: 'An unexpected error occurred' });
  }
}
