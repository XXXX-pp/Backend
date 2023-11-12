
import {v4 as uuidv4} from "uuid"
import { updatePostComment } from "../../workers/dbWork.js";
import { decodeJwt } from "../../utils/utilities.js";

export const postComment = async (req, res) => {
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey)
    const comment = req.body
    if (decodedData) {
      try {
        const result = updatePostComment(comment,uuidv4())
      
        if (result.nModified === 0) {
          console.log('No documents matched the query');
          res.status(400).json({status: 400});
        } else {
          res.status(200).json({status: 200});
        }
      } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).json({status: 500});
      } 
    }
}
