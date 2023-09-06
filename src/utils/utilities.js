import jwt from "jsonwebtoken";
import { v4 as uuid } from 'uuid';
import dotenv from "dotenv";

dotenv.config();

export const generateJwtToken = async (user)=>{
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE});
    return token
}

export const generateUUID = uuid()