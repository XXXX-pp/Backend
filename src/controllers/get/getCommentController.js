import { decodeJwt } from "../../utils/utilities.js";
import { getPostComments } from "../../workers/dbWork.js";

export const getComments = async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey);
    const postId = req.params.postId;

    if (!decodedData) {
      console.error('Unauthorized request');
      return res.status(401).json({ status: 401, message: 'Unauthorized request' });
    }

    try {
      const comments = await getPostComments(postId);

      if (!comments) {
        console.log('No comments found for the given postId');
        return res.status(404).json({ status: 404, message: 'No comments found for the given postId' });
      }

      if (Array.isArray(comments)) {
        const reversedComments = comments.slice().reverse();
        return res.json(reversedComments);
      } else {
        console.error('Invalid or missing comments:', comments);
        return res.status(500).json({ status: 500, message: 'Invalid or missing comments' });
      }
    } catch (error) {
      console.error('Error while fetching comments:', error);
      return res.status(500).json({ status: 500, message: 'Error while fetching comments' });
    }
  } catch (error) {
    // Log any unexpected error that occurs during request processing
    console.error('Unexpected error:', error);
    return res.status(500).json({ status: 500, message: 'An unexpected error occurred' });
  }
};

