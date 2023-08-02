import cloudinary from "../config/cloudinaryConfig.js";
import * as fs from "fs";

export const uploadFile = async (req, res) => {
  try {
    const { path, originalname } = req.file;
    if (path) {
      await cloudinary.uploader.upload(path, { public_id: originalname })
        .then((result) =>
          res.json({
            success: true,
            data: result,
          })
        );
      fs.unlink(path, (err) => {});
    } else {
      throw new Error("file not defined");
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: err,
    });
    console.log(err);
  }
};
