
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

    console.log(user)
    
    if (user){
    const postArray = user.posts
    
    postArray.map(async (post)=>{
      await CommentModel.deleteMany({postId:post})  
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
