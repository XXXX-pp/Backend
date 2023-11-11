import { newPost, uploadImageFile, uploadImageStream } from "../../utils/utilities.js";

export const createPost = async (req, res) => {
  try { 
    const {username,description,mode,images} = req.body;
    const comments = []

    if (mode === 'camera') {
      const imageUrl = await uploadImageStream(images) 
      await newPost(imageUrl,username,description,comments)
    }  
    if (mode === 'gallery') {
      const imageUrl = await uploadImageFile(req.files)
      await newPost(imageUrl,username,description,comments)
    }
    res.status(200).json({
      status: 200,
    });
  } catch (error) {
    console.error("Error processing images:", error);
    res.json({status: 500})
  }
};

