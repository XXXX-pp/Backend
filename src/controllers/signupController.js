import bcrypt from "bcryptjs";
import { findUser, saveUser} from "../workers/dbWork.js"
import { UserModel } from "../model/userModel.js";
import { sendUserOtp }from "./otpController.js";

export const createUser = async (req, res) => {
  try {
    const { username, phonenumber, password, email } = req.body;
    //check if user already exists
    const userExists = await findUser(username,phonenumber,email)
  
    if (userExists) {
      return res.status(409).json({
        success: false,
        message: "User with details already exists",
        data: null,
      });
    }
    
    //encrypt user password
    const saltRounds = +process.env.SALT_WORKER;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //if user does not exist create an unverified new user
    if (!userExists){
      const user = await saveUser(username,email,phonenumber,hashedPassword)
      
      //send an otp after user creation
      const otpStatus = await sendUserOtp(user._id,email)
      
      //if user is created and otp is sent, send a JSON response
      if(otpStatus) return res.status(201).json({
        success: true,
        message: `user created successfully`,
        data: user,
        otpStatus:otpStatus
      });
    };
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message:`internal server error` });
  }
};