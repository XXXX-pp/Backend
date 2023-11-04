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

export const getPosts = async (req, res) => {
  // get the token from the request to personalize the feed
  const token = req.header('Authorization').split(' ')[1];
  const secretKey = process.env.JWT_SECRET;
  const decodedData = decodeJwt(token, secretKey)
  const userId = decodedData.user._id
 try {
    const items = await PostModel.find().maxTimeMS(40000);
    return res.json({items, userId})
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getPostById = async (req, res) => {
  const postId = req.params.postId;
  try {
    const post = await PostModel.findOne({ postId });
    if (!post) {
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
    const userId = decodedData.user._id
  try {
    const posts = await PostModel
      .find()
      .sort({ likes: -1 }) // Sort in descending order based on likes
      .limit(5); // Limit to 5 posts
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Server error' });
  }
}
