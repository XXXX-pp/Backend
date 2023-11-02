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
        const decodedData = decodeJwt(token, secretKey)
        if (decodedData) {
          // check if one photo has already been liked.. check if it has been liked before
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
        
            const likedBy = post[imageType].likedBy; // check if the userid exists in any of them
        
            if (!likedBy.includes(decodedData.user._id)) {
              // User has not liked the image, so "like" it
              const query = { _id: postId };
              const updateObject = {
                $inc: { [`${imageType}.likes`]: 1 },
                $push: { [`${imageType}.likedBy`]: decodedData.user._id },
              };
        
              try {
                const result = await PostModel.updateOne(query, updateObject);
                if (result.nModified === 0) {
                  console.log('Update failed: No documents matched the query');
                  return res.status(404).json({ message: 'No documents matched the query', status: 404 });
                }
        
                console.log('Image liked successfully.');
              } catch (error) {
                console.error('Error updating the document:', error);
                return res.status(500).json({ error: 'Server error', status: 500 });
              }
            } else {
              console.log('unlike photo')
            }
          }
          res.json({ message: 'Likes updated successfully', status: 200 });
        }
        
      } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
      }
        
}