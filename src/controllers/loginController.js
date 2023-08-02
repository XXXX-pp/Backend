import bcrypt from "bcryptjs";
import { findUser } from "../workers/dbWork.js"
import { generateJwtToken } from "../utils/utilities.js";


//controller to login user
export async function loginUser(req, res) {
  const { username, password } = req.body;

  try {
    //check if the user exists
    const user = await findUser(username)
    
    if (!user){
      return res
        .status(400)
        .json({ success: false, message: "user not found", data: null });
    }

    //if user exists verify the user password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res
        .status(400)
        .json({ success: false, message: "invalid cridentials", data: null });
    }
    
    //if user password matches send jwt token to login user
    const token = await generateJwtToken(user)
    return res.status(200).json({
      success: true,
      message: `user login successfully`,
      data: user,
      token,
    });
  }catch (error) {
    console.log(error);
    return res.status(500).json({ message: `internal server error` });
  }
}