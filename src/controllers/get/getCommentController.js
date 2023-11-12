import jwt from "jsonwebtoken";
import { CommentModel } from "../../model/commentModel.js";
import { decodeJwt } from "../../utils/utilities.js";
import { getPostComments } from "../../workers/dbWork.js";

export const getComments = async (req, res) => {
  const token = req.header('Authorization').split(' ')[1]
  const secretKey = process.env.JWT_SECRET;
  const decodedData = decodeJwt(token, secretKey)
  const postId = req.params.postId

  if (decodedData) {
    try {
      const comment = await getPostComments(postId)
      if (!comment) {
        return res.status(404).json({status:404})
      }
      res.status(200).json(comment.comments)
    } catch (error) {
      console.error('Error while fetching comments:', error);
      res.status(500).json({status:500})
    }
  }
}
