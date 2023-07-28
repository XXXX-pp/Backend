import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { findUser } from "../workers/dbWork.js"
import { UserModel } from "../model/userModel.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE;


export async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    // Checking if the user exist
    const user = await findUser(username)

    if (!user){
      return res
        .status(400)
        .json({ success: false, message: "user not found", data: null });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "invalid cridentials", data: null });
    }
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRE });
    return res.status(200).json({
      success: true,
      message: `user login successfully`,
      data: user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `internal server error` });
  }
}