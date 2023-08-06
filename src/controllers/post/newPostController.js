import cloudinary from "../../config/cloudinaryConfig.js";
import { generateUUID } from "../../utils/utilities.js";
import { createNewPost, findUser, updateUserPosts } from '../../workers/dbWork.js'
import * as fs from "fs";

export const createPost = async (req, res) => {
  try {
    const uploadStatus=[]

    for (let i = 0; i < req.files.length; i++) {
      const path = req.files[i].path;
      const originalname = req.files[i].originalname
      const result = await cloudinary.uploader.upload(path, { public_id: originalname + Date.now() });
      fs.unlink(path, (err) => {});
      uploadStatus.push(result)
    }

    const {user,description} = req.body
    const firstImageLink=uploadStatus[0].url
    const secondImageLink=uploadStatus[1].url
    
    const newPostStatus = await createNewPost(user.toLowerCase(),description,firstImageLink,secondImageLink,'1000',generateUUID)
    
    await updateUserPosts(user.toLowerCase(),newPostStatus.postId)
    
    res.json({  
      success: true,
      data: {
        uploadStatus1: uploadStatus[0].created_at,
        uploadStatus2: uploadStatus[1].created_at,
      }, 
      post: newPostStatus
    })
    
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Upload failed",
      error: err,
    });
    console.log(err);
  }
};
