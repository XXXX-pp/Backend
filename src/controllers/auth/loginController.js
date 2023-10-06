import bcrypt from "bcryptjs";
import { findUser } from "../../workers/dbWork.js"
import { generateJwtToken } from "../../utils/utilities.js";


//controller to login user
export async function loginUser(req, res) {
  const { username,email, password } = req.body;

  try {
    //check if the user exists
    const user = await findUser(username.toLowerCase(),email)
    
    if (!user){
      return res.json({ success: false, data: null, status: 404 });
    }

    //if user exists verify the user password
    const passwordMatch = await bcrypt.compare(password, user.password);
    
    if (!passwordMatch) {
      return res.json({ success: false,  data: null, status: 400 });
    }
    
    //if user password matches send jwt token to login user
    const token = await generateJwtToken(user)
    return res.json({
      status: 200,
      success: true,
      data: user,
      token,
    });
  }catch (error) {
    console.log(error);
    return res.status(500).json({ message: `internal server error` });
  }
}