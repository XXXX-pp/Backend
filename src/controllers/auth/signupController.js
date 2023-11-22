import bcrypt from "bcryptjs";
import { findUser, saveUser} from "../../workers/dbWork.js"
import { sendUserOtp }from "./otpController.js";

export const createUser = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const posts = [];
    const postsYouLiked = [];
    const postsYouSaved = [];
    const totalNoOfLikes = 0;

    // Check for request body
    if (!username || !password || !email) {
      return res.status(400).json({
        status: 400,
        message: 'Username, password, and email are required fields.',
      });
    }

    // Check if user details are already registered
    const userExists = await findUser(username, email);
    if (userExists) {
      return res.status(409).json({
        status: 409,
        isVerified: userExists.isVerified,
        message: 'User already exists with the provided details.',
      });
    }

    // If user does not exist, create the user and send email OTP
    const saltRounds = +process.env.SALT_WORKER;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userSaved = await saveUser(username.toLowerCase(), email, hashedPassword, posts, postsYouLiked, postsYouSaved, totalNoOfLikes);

    if (!userSaved) {
      return res.status(500).json({
        status: 500,
        message: 'Error creating user. Please try again later.',
      });
    }

    const otpStatus = await sendUserOtp(userSaved._id, email, username, password);

    if (otpStatus.error) {
      throw new Error('Server could not send OTP');
    }

    if (otpStatus.status === true) {
      return res.status(201).json({
        status: 201,
        userId: userSaved._id,
        email: userSaved.email,
        message: 'User created successfully. OTP sent to email.',
      });
    }

    if (otpStatus.status === false) {
      return res.status(500).json({
        status: 500,
        message: 'Error sending OTP. Please try again later.',
      });
    }
  } catch (error) {
    console.error('Error in createUser:', error);

    res.status(500).json({
      status: 500,
      message: 'Server error, please try again later.',
    });
  }
};
