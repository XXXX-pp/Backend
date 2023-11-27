import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";
import { createNewCommentSection, createNewPost, updateUserPosts } from "../workers/dbWork.js";
import { promises as fsPromises } from 'fs'; // Use fs.promises for promise-based file operations
import { Readable } from 'stream';
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

export const uploadImageStream = async (images) => {
  const imageUrl = [];
  const imageObject = images || {};
  const imageKeys = Object.keys(imageObject);

  const uploadPromises = imageKeys.map(async (key) => {
    const imageData = imageObject[key].split(';base64,').pop();
    const fileBuffer = Buffer.from(imageData, 'base64');
    const publicId = `custom_unique_id_${Date.now()}`;
    const fileStream = new Readable();
    fileStream.push(fileBuffer);
    fileStream.push(null);

    try {
      const result = await new Promise((resolve, reject) => {
        const cloudinaryResponse = cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            public_id: publicId,
          },
          (error, result) => {
            if (error) {
              console.error('Error uploading to Cloudinary:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        fileStream.pipe(cloudinaryResponse);
      });

      if (result.secure_url) {
        imageUrl.push(result.secure_url);
      } else {
        console.error('Cloudinary response did not contain a secure URL:', result);
      }
    } catch (error) {
      console.error('Error during image upload:', error);
    }
  });

  try {
    await Promise.all(uploadPromises);
    return imageUrl;
  } catch (error) {
    // Log or handle the error as needed
    console.error('Error during image uploads:', error);
    throw new Error('Error during image uploads.');
  }
};

export const uploadImageFile = async (files) => {
  const imageUrls = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const path = files[i].path;
      const publicId = `custom_unique_id_${Date.now()}`;
      const result = await cloudinary.uploader.upload(path, { public_id: publicId });
      await unlinkFile(path);
      imageUrls.push(result.secure_url);
    }

    return imageUrls;
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error uploading image file:", error);
    // Propagate the error to the caller or handle it as needed
    throw new Error("Error uploading image file.");
  }
};


export const uploadMediaFile = async (files) => {
  const mediaUrls = [];

  try {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const path = file.path;

      const isImage = file.mimetype.startsWith('image');
      const isVideo = file.mimetype.startsWith('video');

      if (isImage || isVideo) {
        const publicId = isImage ? `custom_unique_id_${Date.now()}` : `video_${Date.now()}`;
        const result = await cloudinary.uploader.upload(path, { public_id: publicId, resource_type: isVideo ? 'video' : undefined });
        await unlinkFile(path);
        mediaUrls.push(result.secure_url);
      } else {
        console.log(`Unsupported file type: ${file.mimetype}`);
      }
    }

    return mediaUrls;
  } catch (error) {
    console.error("Error uploading media file:", error);
    throw new Error("Error uploading media file.");
  }
};


async function unlinkFile(path) {
  try {
    await fsPromises.unlink(path);
    console.log(`File ${path} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting file ${path}:`, error);
  }
}


export const newPost = async (imageUrl, username, description, comments) => {
  try {
    const firstImage = {
      src: imageUrl[0],
      likes: 0,
      likedBy: [],
    };

    const secondImage = {
      src: imageUrl[1],
      likes: 0,
      likedBy: [],
    };

    const noOfComments = 0;
    const postId = uuidv4();

    const post = await createNewPost(
      username.toLowerCase(),
      description,
      firstImage,
      secondImage,
      postId,
      noOfComments
    );

    if (!post) {
      // Handle the case where creating a new post fails
      throw new Error("Failed to create a new post.");
    }

    await createNewCommentSection(postId, comments);

    if (username) {
      await updateUserPosts(username.toLowerCase(), post.postId);
    } else {
      // Handle the case where the username is not available
      throw new Error("Username is required.");
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error creating a new post:", error);
    // Propagate the error to the caller or handle it as needed
    throw error;
  }
};
