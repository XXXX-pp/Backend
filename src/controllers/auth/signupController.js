import bcrypt from "bcryptjs";
import { findUser, saveUser} from "../../workers/dbWork.js"
import { sendUserOtp }from "./otpController.js";

export const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const {posts,postsYouLiked,postsYouSaved}=[] 

    const userExists = await findUser(username,email)
    
    //encrypt user password
    const saltRounds = +process.env.SALT_WORKER;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    //if user does not exist create an unverified new user
    if (!userExists){
      const user = await saveUser(username.toLowerCase(),email,hashedPassword,posts,postsYouLiked,postsYouSaved)
      
      //send an otp after user creation
      const otpStatus = await sendUserOtp(user._id,email,username,password)
      
      //if user is created and otp is sent, send a JSON response
      if(otpStatus.status === false) return res.json({
        status: 400,
        message: 'Oops there was an error, OTP could not be sent'
      });
      if(otpStatus.status === true) return res.json({
        status: 201,
        userId: user._id,
        email: user.email,
        message: `An otp has been sent to ${email}`
      });
    };
  } catch (error) {
    console.log(error);
    return res.json({ 
      status: 500,
      message: 'Internal Server Error, please try again in a few minutes'
    });
  }
};