import jwt from "jsonwebtoken";
import { CommentModel } from "../../model/commentModel.js";

function decodeJwt(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null;
  }
}

export const deleteComment = async (req, res) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        const secretKey = process.env.JWT_SECRET;
        const decodedData = decodeJwt(token, secretKey);
        const commentId = req.query.commentId;
        const postId = req.query.postId;
        
        if (decodedData) {
          try {
            const comments = await CommentModel.findOne({ postId });
            
            if (!comments) {
              return res.status(404).json({ message: 'No comments found for the given postId' });
            }
            
            const updatedComments = comments.comments.filter((comment) => comment.commentId !== commentId);  
            await CommentModel.updateOne({ postId }, { comments: updatedComments });
            res.status(200).json({ message: 'Comment deleted successfully' });
          } catch (error) {
            // Log the error message for debugging
            console.error('Error deleting the comment:', error);
            res.status(500).json({ message: 'Error while deleting the comment' });
          }
        } else {
          // Log a message indicating that the request didn't meet the authorization criteria
          console.error('Unauthorized request');
          res.status(401).json({ message: 'Unauthorized request' });
        }
      } catch (error) {
        // Log any unexpected error that occurs during request processing
        console.error('Unexpected error:', error);
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
      
}