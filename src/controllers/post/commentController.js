import jwt from "jsonwebtoken";
import { CommentModel } from "../../model/commentModel.js";
import {v4 as uuidv4} from "uuid"

function decodeJwt(token, secretKey) {
    try {
      const decoded = jwt.verify(token, secretKey);
      return decoded;
    } catch (error) {
      console.error('JWT verification error:', error.message);
      return null;
    }
}


export const postComment = async (req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey)
    const newComment = req.body
    if (decodedData) {
      try {
        const id = await uuidv4()
        const result = await CommentModel.updateOne(
          { postId: newComment.postId },
          {
            $push: {
              comments: { username: newComment.username, comment: newComment.comment, commentId: id },
            },
          }
        );
      
        if (result.nModified === 0) {
          console.log('No documents matched the query');
          res.json({success: false, status: 500});
        } else {
          res.json({success: true,status: 200});
        }
      } catch (error) {
        console.error('Error adding comment:', error);
        res.json({success: false, status: 500});
      } 
    }
}
