import { PostModel } from "../../model/postModel.js";
import jwt from "jsonwebtoken";
import { UserModel } from "../../model/userModel.js";

function decodeJwt(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null;
  }
}

export const getPosts = async (req, res) => {
  // get the token from the request to personalize the feed
  const token = req.header('Authorization').split(' ')[1];
  const secretKey = process.env.JWT_SECRET;
  const decodedData = decodeJwt(token, secretKey)
  const userId = decodedData.user._id
  try {
    const user = await UserModel.findOne({ _id: userId }).exec();
    const items = await PostModel.find().maxTimeMS(30000);
    if (user) {
      const postsYouSaved = user.postsYouSaved;
      return res.json({ items, userId, postsYouSaved });
    } else {
      console.log('User not found');
      // Handle the case when the user is not found
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error finding the user:', error);
    // Handle the error as needed
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getPostById = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await PostModel.findOne({ postId });
    if (!post) {
      console.log('postIDs not found')
      return res.status(404).json({ error: 'Post not found' });
    }
    return res.json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPostsByLikes = async (req, res) => {
    // get the token from the request to personalize the feed
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey)
  try {
    const posts = await PostModel
      .find()
      .sort({ likes: -1 }) 
      .limit(5);
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
