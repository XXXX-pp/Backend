import cloudinary from "../../config/cloudinaryConfig.js";
import { generateUUID } from "../../utils/utilities.js";
import { createNewPost, findUser, updateUserPosts } from '../../workers/dbWork.js'
import { Readable } from 'stream';
import * as fs from "fs";

export const createPost = async (req, res) => {
  try { 
    const requestData = req.body;
    const user = requestData.username
    const description = requestData.description
    if (requestData.mode === 'camera') {
      if (!requestData.images || Object.keys(requestData.images).length === 0) {
        res.status(400).send("No image data provided.");
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
          likes: '200',
          likedBy: [],
        };

        const secondImage = {
          src: uploadStatus[1],
          likes: '200',
          likedBy: [],
        };

        const newPostStatus = await createNewPost(
          user.toLowerCase(),
          description,
          firstImage,
          secondImage,
          '1000',
          generateUUID
        );

        await updateUserPosts(user.toLowerCase(), newPostStatus.postId);
        res.json({
          success: true,
          data: {
          uploadStatus1: uploadStatus[0].created_at,
          uploadStatus2: uploadStatus[1].created_at,
        },
        post: newPostStatus,
        });
      }
    } else if (requestData.mode === 'gallery') {
      try {
        // ... (image upload and data processing)
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
          likes:'200',
          likedBy:[]
        }
        const secondImage={
          src:uploadStatus[1].url,
          likes:'200',
          likedBy:[]
        }
        
        const newPostStatus = await createNewPost(user.toLowerCase(),description,firstImage,secondImage,'1000',generateUUID)
        
        await updateUserPosts(user.toLowerCase(),newPostStatus.postId)
        res.json({
          success: true,
          data: {
            uploadStatus1: uploadStatus[0].created_at,
            uploadStatus2: uploadStatus[1].created_at,
          },
          post: newPostStatus,
        });
      } catch (err) {
        console.log(err);
        res.status(500).json({
          success: false,
          error: err,
        });
      }
    } else {
      res.status(400).send("Invalid mode provided.");
    }

    // if (requestData.mode === 'camera') {
    //   const imageObject = requestData.images || {};
    //   const imageKeys = Object.keys(imageObject);

    //   if (imageKeys.length === 0) {
    //     return res.status(400).send("No image data provided.");
    //   }

    //   const uploadStatus = [];
    //   const uploadPromises = imageKeys.map(async (key) => {
    //     const imageData = imageObject[key];
    //     const fileBuffer = Buffer.from(imageData, "base64");
    //     const publicId = `custom_unique_id_${Date.now()}`;
    //     const fileStream = new Readable();
    //     fileStream.push(fileBuffer);
    //     fileStream.push(null);

    //     const result = await new Promise((resolve, reject) => {
    //       const cloudinaryResponse = cloudinary.uploader.upload_stream(
    //         {
    //           resource_type: "auto",
    //           public_id: publicId,
    //         },
    //         (error, result) => {
    //           if (error) {
    //             console.error("Error uploading to Cloudinary:", error);
    //             reject(error);
    //           } else {
    //             resolve(result);
    //           }
    //         }
    //       );
    //       fileStream.pipe(cloudinaryResponse);
    //     });

    //     uploadStatus.push(result.secure_url);
    //   });

    //   await Promise.all(uploadPromises);

    //   const firstImage = {
    //     src: uploadStatus[0],
    //     likes: '200',
    //     likedBy: [],
    //   };

    //   const secondImage = {
    //     src: uploadStatus[1],
    //     likes: '200',
    //     likedBy: [],
    //   };

    //   const newPostStatus = await createNewPost(
    //     user.toLowerCase(),
    //     description,
    //     firstImage,
    //     secondImage,
    //     '1000',
    //     generateUUID
    //   );

    //   await updateUserPosts(user.toLowerCase(), newPostStatus.postId);

    //   res.json({
    //     success: true,
    //     // data: {
    //     //   uploadStatus1: uploadStatus[0].created_at,
    //     //   uploadStatus2: uploadStatus[1].created_at,
    //     // },
    //     // post: newPostStatus,
    //   });
    // }  
    // if (requestData.mode === 'gallery') {
    //   try {
    //     const uploadStatus=[]
    //     const user = req.body.username
    //     const description = req.body.description
    //     for (let i = 0; i < req.files.length; i++) {
    //       const path = req.files[i].path;
    //       const originalname = req.files[i].originalname
    //       const publicId = `custom_unique_id_${Date.now()}`;
    //       const result = await cloudinary.uploader.upload(path, { public_id: publicId + Date.now() });
    //       fs.unlink(path, (err) => {});
    //       uploadStatus.push(result)
    //     }
    
    //     const firstImage={
    //       src:uploadStatus[0].url,
    //       likes:'200',
    //       likedBy:[]
    //     }
    //     const secondImage={
    //       src:uploadStatus[1].url,
    //       likes:'200',
    //       likedBy:[]
    //     }
        
    //     const newPostStatus = await createNewPost(user.toLowerCase(),description,firstImage,secondImage,'1000',generateUUID)
        
    //     await updateUserPosts(user.toLowerCase(),newPostStatus.postId)
        
    //     res.json({  
    //       success: true,
    //       data: {
    //         uploadStatus1: uploadStatus[0].created_at,
    //         uploadStatus2: uploadStatus[1].created_at,
    //       }, 
    //       post: newPostStatus
    //     })
    //   }
    //   catch (err) {
    //     console.log(err);
    //     res.status(500).json({
    //       success: false,
    //       error: err,
    //     });
    //   }
    // } else {
    //   return res.status(400).send("Invalid mode provided.");
    // }
  } catch (error) {
    console.error("Error processing images:", error);
    res.status(500).send("Error processing images.");
  }
};

