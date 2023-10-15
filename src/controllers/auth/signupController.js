import bcrypt from "bcryptjs";
import { findUser, saveUser} from "../../workers/dbWork.js"
import { sendUserOtp }from "./otpController.js";

export const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const {posts,postsYouLiked,postsYouSaved}=[]

    //check for request body
    if(!username ||!password ||!email) return res.status(404).json({
      status: 404,
      message:'Details cannot be empty'
    })
    
    //check if details is already registered
    const userExists = await findUser(username,email)
    if(userExists){
      if (userExists.isVerified) return res.status(409).json({
        status:409,
        isVerified:userExists.isVerified,
        message:'User with details already exists, proceed to login'
      })

      if (!userExists.isVerified) return res.status(409).json({
        status:409,
        isVerified:userExists.isVerified,
        message:'User with details already exists verify otp to continue'
      })
    }
    
    //if user does not exist create the user and send email otp
    if (!userExists){
      const saltRounds = +process.env.SALT_WORKER;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const userSaved = await saveUser(username.toLowerCase(),email,hashedPassword,posts,postsYouLiked,postsYouSaved)
      
      //send otp if user is saved to database
      if(userSaved){
        const otpStatus = await sendUserOtp(userSaved._id,email,username,password)
        if(otpStatus.error) throw new Error('Server could not send otp, login and try again later')
        if(otpStatus.status === true) return res.status(201).json({
          status: 201,
          userId: userSaved._id,
          email: userSaved.email,
          message:'Otp sent successfully'
        });

        if(otpStatus.status === false) return res.status(400).json({
          status: 400,
          message:'Failed to send otp, check email'
        });
      }   
    }
  } catch (error) {
    console.log(error)
    return res.status(500).json({ 
      status: 500,
      message:'Server error, please try again later, '+ error.message
    });
  }
};