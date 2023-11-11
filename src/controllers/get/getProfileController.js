import { decodeJwt } from "../../utils/utilities.js";
import { findUser } from "../../workers/dbWork.js";

export const getProfile = async (req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey)
    if (decodedData) {
      const userId = decodedData.user._id
      const user = await findUser(null,null,userId)
        if (user) {
          const {username, posts, postYouLiked, postsYouSaved, totalNoOfLikes, _id} = user
          res.status(200).json({username, posts, postYouLiked, postsYouSaved, totalNoOfLikes, _id})
        } else {
            console.log('Profile not found.'); 
            res.status(401).json({status:401})}
    } else {
      console.log('JWT could not be decoded');
      res.status(500).json({status:500})
    }
    
}