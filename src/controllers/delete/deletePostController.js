import { PostModel } from "../../model/postModel.js";

export const deletePost = async (req, res) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        const secretKey = process.env.JWT_SECRET;
        const decodedData = decodeJwt(token, secretKey)
        const postId = req.params.postId;

        if (decodedData) {
            try {
              // Find the post by postId
              const post = await PostModel.findOne({ postId }); // might not find post till i convert stuff
        
              if (!post) {
                return res.status(404).json({ message: 'Post not found' });
              }

              // Find the user by username (assuming this is how you identify users)
              const user = await UserModel.findOne({ username: decodedData.username });
        
              if (!user) {
                return res.status(404).json({ message: 'User not found' });
              }
        
              // Check if the user is the creator of the post
              if (user.username === post.username) {
                // Check if postId is in the user's post array
                if (user.posts.includes(postId)) {
                  // Remove postId from the user's post array
                  user.posts.pull(postId);
                  await user.save();
        
                  // Remove the post from the post collection
                  await PostModel.findByIdAndRemove(postId);
        
                  return res.status(200).json({ message: 'Post deleted successfully' });
                } else {
                  return res.status(403).json({ message: 'User does not have permission to delete this post' });
                }
              } else {
                return res.status(403).json({ message: 'User does not have permission to delete this post' });
              }
            } catch (error) {
              console.error(error);
              return res.status(500).json({ message: 'Internal Server Error' });
            }
          } else {
            return res.status(404).json({ message: 'Could not verify token' });
          }
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}