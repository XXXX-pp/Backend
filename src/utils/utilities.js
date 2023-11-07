import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';
import dotenv from "dotenv";

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
};

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