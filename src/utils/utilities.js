import jwt from "jsonwebtoken";

export const generateJwtToken = async (user)=>{
    const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE});
    return token
}