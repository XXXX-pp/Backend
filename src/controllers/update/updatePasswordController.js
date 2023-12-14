import jwt from "jsonwebtoken";
import { findUser, updateUserPassword } from "../../workers/dbWork.js";

function decodeJwt(token, secretKey) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return null;
  }
}


export const updatePassword = async (req, res) => {
  try {
    const { email, newPassword}= req.body;
    const token = req.header('Authorization').split(' ')[1];
    const secretKey = process.env.JWT_SECRET;
    const decodedData = decodeJwt(token, secretKey);

    if (!decodedData) {
      console.log('Unauthorized request');
      return res.status(401).json({ message: 'Unauthorized request', status: 401 });
    }
     
    const user = findUser("",email)
    updateUserPassword(decodedData.id,newPassword)
    
    res.status(200).json({status:200})

  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 500 });
  }
};
