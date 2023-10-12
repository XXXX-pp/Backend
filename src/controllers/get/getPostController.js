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