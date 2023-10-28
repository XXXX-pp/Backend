import cloudinary from "../../config/cloudinaryConfig.js";
import { createNewPost, findUser, updateUserPosts } from '../../workers/dbWork.js'
import { Readable } from 'stream';
import * as fs from "fs";
import {v4 as uuidv4} from "uuid"

function extractObjectIdValue(inputString) {
  if (typeof inputString !== 'string') {
    return null; // Return null or handle the non-string case as needed
  }

  const regex = /\("([^"]+)"\)/;
  const matches = inputString.match(regex);

  if (matches && matches.length > 1) {
    return matches[1];
  } else {
    return null; // Return null or handle the case as needed
  }
}

export const createPost = async (req, res) => {
  try { 
    const requestData = req.body;
    const user = requestData.username
    const description = requestData.description
    if (requestData.mode === 'camera') {
      if (!requestData.images || Object.keys(requestData.images).length === 0) {
        res.json({status: 400, message: 'No image data provided'});
      } else {
      const imageObject = requestData.images || {};
      const imageKeys = Object.keys(imageObject);
        const uploadStatus = [];
        const uploadPromises = imageKeys.map(async (key) => {
          const imageData = imageObject[key];
          const fileBuffer = Buffer.from(imageData, "base64");
          const publicId = `custom_unique_id_${Date.now()}`;
          const fileStream = new Readable();
          fileStream.push(fileBuffer);
          fileStream.push(null);

          const result = await new Promise((resolve, reject) => {
            const cloudinaryResponse = cloudinary.uploader.upload_stream(
              {
                resource_type: "auto",
                public_id: publicId,
              },
              (error, result) => {
                if (error) {
                  console.error("Error uploading to Cloudinary:", error);
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
            fileStream.pipe(cloudinaryResponse);
          });

          uploadStatus.push(result.secure_url);
        });

        await Promise.all(uploadPromises);

        const firstImage = {
          src: uploadStatus[0],
          likes: 0,
          likedBy: [],
        };

        const secondImage = {
          src: uploadStatus[1],
          likes: 0,
          likedBy: [],
        };
        const postId = await uuidv4()
        const newPostStatus = await createNewPost(
          user.toLowerCase(),
          description,
          firstImage,
          secondImage,
          0,
          postId
        );

        await updateUserPosts(user.toLowerCase(), newPostStatus.postId);
        res.json({
          success: true,
          status: 200,
          message: 'Uploaded successfully'
        });
      }
    } else if (requestData.mode === 'gallery') {
      try {
        const uploadStatus=[]
        const user = req.body.username
        const description = req.body.description
        for (let i = 0; i < req.files.length; i++) {
          const path = req.files[i].path;
          const originalname = req.files[i].originalname
          const publicId = `custom_unique_id_${Date.now()}`;
          const result = await cloudinary.uploader.upload(path, { public_id: publicId + Date.now() });
          fs.unlink(path, (err) => {});
          uploadStatus.push(result)
        }
    
        const firstImage={
          src:uploadStatus[0].url,
          likes:0,
          likedBy:[]
        }
        const secondImage={
          src:uploadStatus[1].url,
          likes:0,
          likedBy:[]
        }
        const postId = await uuidv4()
        const newPostStatus = await createNewPost(user.toLowerCase(),description,firstImage,secondImage,0, postId)
        await updateUserPosts(user.toLowerCase(), newPostStatus.postId)
        res.json({
          success: true,
          status: 200,
          message: 'Uploaded successfully'
        });
      } catch (err) {
        console.log(err);
        res.json({success: false, status: 500, message: 'Something went wrong please try again later'});
      }
    } else {
       res.json({success: false, status: 500, message: 'invalid mode provided'});
    }
  } catch (error) {
    console.error("Error processing images:", error);
    res.json({success: false, status: 500, message: 'Error processing messages'});
  }
};

