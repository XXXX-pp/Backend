import { PostModel } from "../../model/postModel.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../../model/userModel.js";
import { CommentModel } from "../../model/commentModel.js";
import cloudinary from "../../config/cloudinaryConfig.js";

function decodeJwt(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null;
  }
}

async function deleteImagesFromCloudinary(publicIds) {
  try {
    const results = await Promise.all(publicIds.map(async (publicId) => {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log(`Deletion result for ${publicId}:`, result);
      return result;
    }));

    return results;
  } catch (error) {
    console.error('Error deleting images from Cloudinary:', error);
    throw error;
  }
}


function getPublicIdFromCloudinaryUrl(url) {
  const match = url?.match(/\/v\d+\/([^\/.]+)\./);
  return match ? match[1] : null;
}

export const deletePost = async (req, res) => {
  try {
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey);

    if (!decodedData) {
      return res.status(404).json({ message: 'Could not verify token' });
    }

    const postId = req.params.postId;

    try {
      const post = await PostModel.findOneAndRemove({ postId });

      if (!post) {
        console.log('Post not found');
        return res.status(404).json({ message: 'Post not found' });
      }

      const firstImagePublicId = await getPublicIdFromCloudinaryUrl(post.firstImage.src);
      const secondImagePublicId = await getPublicIdFromCloudinaryUrl(post.secondImage.src);
      const publicIdsToDelete = [firstImagePublicId, secondImagePublicId].filter(Boolean);

      await deleteImagesFromCloudinary(publicIdsToDelete);
      console.log('Images deleted from Cloudinary');

      const user = await UserModel.findOne({ username: decodedData.user.username });

      if (!user) {
        console.log('User not found');
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.username === post.user) {
        const postIndex = user.posts.indexOf(postId);
        const savePostIndex = user.postsYouSaved.indexOf(postId);

        if (postIndex === -1) {
          console.log('Post not found in user.posts');
          return res.status(404).json({ message: 'Post not found in user.posts' });
        }

        await CommentModel.deleteOne({ postId: postId });
        user.postsYouSaved.splice(savePostIndex, 1);
        user.posts.splice(postIndex, 1);
        await user.save();

        return res.status(200).json({ message: 'Success' });
      } else {
        return res.status(403).json({ message: 'User does not have permission to delete this post' });
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } catch (error) {
    console.error('Error in deletePost:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

