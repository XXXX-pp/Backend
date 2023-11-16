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
      if (comment && Array.isArray(comment)) {
        const reversedComments = comment.slice().reverse();
        res.json(reversedComments)
      } else {
        console.error('Invalid or missing comments:', comment);
        return [];
      }
    } catch (error) {
      console.error('Error while fetching comments:', error);
      res.status(500).json({status:500})
    }
  }
}
