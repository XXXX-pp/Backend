import { PostModel } from "../../model/postModel.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../../model/userModel.js";
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


export const deletePost = async (req, res) => {
    try {
        const token = req.header('Authorization').split(' ')[1];
        const secretKey = process.env.JWT_SECRET;
        const decodedData = decodeJwt(token, secretKey)
        const postId = req.params.postId;
        if (decodedData) {
            try {
              const post = await PostModel.findOneAndRemove({ postId });
              if (!post) {
                console.log('post not found')
                return res.status(404).json({ message: 'Post not found' });
              }
              const user = await UserModel.findOne({ username: decodedData.user.username });
              if (!user) {
                console.log('user not found')
                return res.status(404).json({ message: 'User not found' });
              }
              if (user.username === post.user) {
                const postIndex = user.posts.indexOf(postId);

                if (postIndex === -1) {
                  console.log('Post not found in user.posts');
                  return;
                }
                // find comment object and delete it too
                await CommentModel.deleteOne({ postId: postId });
                user.posts.splice(postIndex, 1);
                user.postsYouSaved.splice(postIndex, 1)
                await user.save(); 
                return res.status(200).json({message: 'success'});
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
