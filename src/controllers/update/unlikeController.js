import { PostModel } from "../../../src/model/postModel.js";
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

export const unlikeImage = async (req, res) => {
    try {
        const unlikes = req.body;
        const token = req.header('Authorization').split(' ')[1];
        const secretKey = process.env.JWT_SECRET;
        const decodedData = decodeJwt(token, secretKey)
        if (decodedData) {
            // for every object map through
       for (const unlike of unlikes) {
           const { postId, imageType } = unlike; // Destructure the individual unlike object
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
   
           const likedBy = post[imageType].likedBy;
   
           if (likedBy.includes(decodedData.user._id)) {
               // User has liked the image, so "unlike" it
               const query = { _id: postId };
               const updateObject = {
               $inc: { [`${imageType}.likes`]: -1 },
               $pull: { [`${imageType}.likedBy`]: decodedData.user._id },
               };
   
               try {
               const result = await PostModel.updateOne(query, updateObject);
               if (result.nModified === 0) {
                   console.log('Update failed: No documents matched the query');
                   return res.status(404).json({ message: 'No documents matched the query', status: 404 });
                   }
           
                   console.log('Image unliked successfully.');
               } catch (error) {
               console.error('Error updating the document:', error);
               return res.status(500).json({ error: 'Server error', status: 500 });
               }
           } else {
               console.log('you cannot unlike this image')
           }
       }
       res.json({ message: 'unlikes updated successfully', status: 200 });
       } 
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
    }
}