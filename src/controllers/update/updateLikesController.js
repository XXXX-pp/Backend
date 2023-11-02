import { PostModel } from "../../model/postModel.js";
import jwt from "jsonwebtoken";

function decodeJwt(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null;
  }
}



export const updateLikes = async (req, res) => {
  try {
    const updates = req.body;
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey);
  
    if (decodedData) {
      for (const update of updates) {
        const { postId, imageType } = update;
        if (!postId || !imageType) {
          console.log('Bad request: Missing postId or imageType');
          return res.status(400).json({ message: 'Bad request', status: 400 });
        }
  
        const post = await PostModel.findOne({ _id: postId });
        if (!post) {
          console.log('No post found to update');
          return res.status(404).json({ message: 'Post not found', status: 404 });
        }
  
        if (!post[imageType]) {
          console.log('Bad request: Invalid imageType');
          return res.status(400).json({ message: 'Bad request', status: 400 });
        }
  
        const userLikedPost = await PostModel.findOne({
          _id: postId,
          $or: [
            { 'firstImage.likedBy': decodedData.user._id },
            { 'secondImage.likedBy': decodedData.user._id },
          ],
        });
  
        if (!userLikedPost) {
          console.log('You are allowed to like');
          const query = { _id: postId };
          const updateObject = {
            $inc: { [`${imageType}.likes`]: 1 },
            $push: { [`${imageType}.likedBy`]: decodedData.user._id },
          };
          const result = await PostModel.updateOne(query, updateObject);
  
          if (result.nModified === 0) {
            console.log('Update failed: No documents matched the query');
            return res.status(404).json({ message: 'No documents matched the query', status: 404 });
          }
  
          console.log('Image liked successfully.');
        } else {
          console.log('You are not allowed to like');
        }
      }
  
      res.json({ message: 'Likes updated successfully', status: 200 });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Server error' });
  }
  
}