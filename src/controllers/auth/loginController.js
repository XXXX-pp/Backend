import bcrypt from "bcryptjs";
import { findUser } from "../../workers/dbWork.js"
import { generateJwtToken } from "../../utils/utilities.js";


export async function loginUser(req, res) {
  const { username,email, password } = req.body;

  try {
    
    if (!username || !password) return res.status(404).json({
      status: 404,
      message:'Details cannot be empty'
    }) 
    
    const user = await findUser(username.toLowerCase(),email)
    
    if (!user){
      return res.status(404).json({
        success: false, 
        data: null, 
        status: 404 , 
        message: 'User does not exist!' 
      });
    }

    if(user){
      const passwordMatch = await bcrypt.compare(password, user.password);
      const userInfo = { userId: user._id, username: user.username, userLikes: user.totalNoOfLikes, no_Of_Posts: user.posts.length }
  
      if (!passwordMatch) {
        return res.status(401).json({ 
          success: false,  
          data: null, 
          status: 401, 
          message: 'Invalid credentials' 
        });
      }

      if (passwordMatch){
        const token = await generateJwtToken(user)
        return res.status(200).json({
          status: 200,
          success: true,
          data: userInfo,
          token
        })
      }
  }
  }catch (error) {
    console.log(error)
    return res.status(500).json({ 
      message:'Server error, please try again later',
      status: 500
    });
  }
}