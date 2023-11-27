import { newPost, uploadImageStream, uploadMediaFile } from "../../utils/utilities.js";

export const createPost = async (req, res) => {
  try {
    const { username, description, mode, images } = req.body;
    const comments = [];

    if (!username || !description || !mode) {
      return res.status(400).json({
        status: 400,
        message: "Missing required fields in the request body.",
      });
    }

    if (mode === "camera") {
      try {
        const imageUrl = await uploadImageStream(images);
        await newPost(imageUrl, username, description, comments);
        res.status(200).json({
          status: 200,
        });
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError);
        res.status(500).json({
          status: 500,
          message: "Error processing the image.",
        });
      }
    } else if (mode === "gallery") {
      try {
        const imageUrl = await uploadMediaFile(req.files);
        await newPost(imageUrl, username, description, comments);
        res.status(200).json({
          status: 200,
        });
      } catch (uploadError) {
        console.error("Error uploading media file:", uploadError);
        res.status(500).json({
          status: 500,
          message: "Error processing the media file.",
        });
      }
    } else {
      res.status(400).json({
        status: 400,
        message: "Invalid 'mode' specified in the request body.",
      });
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({
      status: 500,
      message: "Internal server error.",
    });
  }
};


