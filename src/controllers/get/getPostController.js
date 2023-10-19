import { PostModel } from "../../model/postModel.js";

export const getPosts = async (req, res) => {
 try {
    const items = await PostModel.find();
    return res.json(items)
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
