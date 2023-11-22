import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";
import { createNewCommentSection, createNewPost, updateUserPosts } from "../workers/dbWork.js";

import { Readable } from 'stream';
import * as fs from "fs";
import cloudinary from "../config/cloudinaryConfig.js";


dotenv.config();

export const generateJwtToken = async (user) => {
    const token = jwt.sign({user}, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    if (!token) {
      res.json({
        status: 400,
        message: "Otp could not be generated",
        })
      console.log('issue generating the token')
    }
    return token;
}

export function decodeJwt(token, secretKey) {
    return jwt.verify(token, secretKey)
}

// export const generateUUID = uuidv4()


// Create a set to store generated UUIDs
function generateUniqueUUID() {
  let newUUID;
  do {
    newUUID = uuidv4();
  } while (generatedUUIDs.has(newUUID));
  generatedUUIDs.add(newUUID); // Add the new UUID to the set
  return newUUID;
}
let generatedUUIDs = new Set();

export const uniqueUUID = generateUniqueUUID();

export const uploadImageStream = async(images)=>{
  const imageUrl = []
  const imageObject = images || {};
  const imageKeys = Object.keys(imageObject);
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
      imageUrl.push(result.secure_url)
    });
  await Promise.all(uploadPromises);
  return imageUrl
}

export const uploadImageFile = async(files)=>{
  const imageUrl = []

  for (let i = 0; i < files.length; i++) {
    const path = files[i].path;
    const publicId = `custom_unique_id_${Date.now()}`;
    const result = await cloudinary.uploader.upload(path, { public_id: publicId});
    fs.unlink(path, (err) => {});
    imageUrl.push(result.secure_url)
  }
  return imageUrl
}

export const deleteImageFile = async(firstImage,secondImage)=>{
    const result = await cloudinary.uploader.destroy(firstImage&&secondImage).then(callback);
    return result
}

export const newPost = async(imageUrl,username,description,comments)=>{
  const firstImage = {
    src: imageUrl[0],
    likes: 0,
    likedBy: [],
  }

  const secondImage = {
    src: imageUrl[1],
    likes: 0,
    likedBy: [],
  }

  const postId = uuidv4()

  const post = await createNewPost(
    username.toLowerCase(),
    description,
    firstImage,
    secondImage,
    postId
  )
  await createNewCommentSection(postId, comments)
    
  await updateUserPosts(username.toLowerCase(), post.postId);
} 