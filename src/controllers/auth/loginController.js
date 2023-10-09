import bcrypt from "bcryptjs";
import { findUser } from "../../workers/dbWork.js"
import { generateJwtToken } from "../../utils/utilities.js";


export async function loginUser(req, res) {
  const { username,email, password } = req.body;

  try {
    //check for request body
    if (!email || !username || !password) return res.status(404).json({
      status: 404,
      message:'Details cannot be empty'
    }) 

    //check if the user exists
    const user = await findUser(username.toLowerCase(),email)
    
    if (!user){
      return res.status(404).json({ 
        success: false, 
        data: null, 
        status: 404 , 
        message: 'User does not exist!' 
      });
    }

    //if user exists verify the user password
    if(user){
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({ 
          success: false,  
          data: null, 
          status: 401, 
          message: 'Invalid credentials' 
        });
      }

      //if user password matches send jwt token to login user
      if (passwordMatch){
        const token = await generateJwtToken(user)
        return res.status(200).json({
          status: 200,
          success: true,
          data: user,
          token
        })
      }
  }
  }catch (error) {
    return res.status(500).json({ 
      message:'Server error, please try again later, '+ error.message
    });
  }
}