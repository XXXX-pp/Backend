import { UserModel } from "../../model/userModel.js";
import jwt from "jsonwebtoken";

const getUserById = async (userId) => {
    try {
      const user = await UserModel.findById(userId).exec();
      return user;
    } catch (error) {
      throw error; 
    }
};

function decodeJwt(token, secretKey) {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return null;
    }
}

export const getProfile = async (req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey);
    if (decodedData) {
        const userId = decodedData.user._id
        getUserById(userId)
        .then((user) => {
            if (user) {
                const {username, posts, postYouLiked, postsYouSaved, totalNoOfLikes, _id} = user
                res.status(200).json({username, posts, postYouLiked, postsYouSaved, totalNoOfLikes, _id})
            } else {
                console.log('Profile not found.'); 
                res.status(401).json({
                  message: 'Unauthorised - please try login in'
                })
            }
         })
        .catch((error) => { 
        console.error('Error:', error);
        });
    } else {
      console.log('JWT could not be decoded');
    }
    
}