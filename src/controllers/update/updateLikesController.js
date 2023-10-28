import { PostModel } from "../../model/postModel.js";

export const updateLikes = async (req, res) => {
    try {
        const updates = req.body;
        for (const update of updates) {
          const { postId, imageType } = update;
      
          // Check if postId and imageType exist
          if (!postId || !imageType) {
            console.log('Bad request: Missing postId or imageType');
            return res.status(400).json({ message: 'Bad request', status: 400 });
          }
      
          const post = await PostModel.findOne({ _id: postId });
          // Check if post exists
          if (!post) {
            console.log('No post found to update');
            return res.status(404).json({ message: 'Post not found', status: 404 });
          }
      
          // Check if the imageType exists on the post object
          if (!post[imageType]) {
            console.log('Bad request: Invalid imageType');
            return res.status(400).json({ message: 'Bad request', status: 400 });
          }
      
          const query = { _id: postId };
          const updateObject = { $inc: { [`${imageType}.likes`]: 1 } };
      
          const result = await PostModel.updateOne(query, updateObject);
      
          if (result.nModified === 0) {
            console.log('Update failed: No documents matched the query');
            return res.status(404).json({ message: 'No documents matched the query', status: 404 });
          }
      
          try {
            await post.save();
          } catch (error) {
            console.error('Error saving post:', error);
            return res.status(500).json({ error: 'Error saving post', status: 500 });
          }
        }
        res.json({ message: 'Likes updated successfully', status: 200 });
      } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ error: 'Server error' });
      }
        
}
 