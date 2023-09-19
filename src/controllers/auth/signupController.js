import bcrypt from "bcryptjs";
import { findUser, saveUser} from "../../workers/dbWork.js"
import { sendUserOtp }from "./otpController.js";

export const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const {posts,postsYouLiked,postsYouSaved}=[] 

    //check if user already exists
    // if (userExists) {
    //   return res.json({
    //     success: false,
    //     status: 409,
    //     message: "User with details already exists",
    //     data: null,
    //   });
    // }

    const userExists = await findUser(username,email)
    
    //encrypt user password
    const saltRounds = +process.env.SALT_WORKER;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //if user does not exist create an unverified new user
    if (!userExists){
      const user = await saveUser(username.toLowerCase(),email,hashedPassword,posts,postsYouLiked,postsYouSaved)
      
      //send an otp after user creation
      const otpStatus = await sendUserOtp(user._id,email)
      
      //if user is created and otp is sent, send a JSON response
      if(otpStatus) return res.json({
        success: true,
        status: 201,
        data: user,
        otpStatus:otpStatus
      });
    };
  } catch (error) {
    console.log(error);
    return res.json({ status: 500});
  }
};