import bcrypt from "bcryptjs";
import { userModel } from "../model/userModel.js";

export async function createUser(req, res) {
  try {
    // Extracting the username, mobilenumber, and password from the request body
    const { userName, phoneNumber, password } = req.body;

    // Checking if a user with the same username already exists
    const userExist = await userModel.findOne({ userName });

    if (userExist) {
      // If a user with the same username exists, send an error response
      return res
        .status(400)
        .json({ success: false, message: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Creating a new user with the provided username, mobilenumber, and password
    const user = await userModel.create({
      userName,
      phoneNumber,
      password: hashedPassword,
    });


    // If user creation is successful, send a JSON response with the user's information
    return res
      .status(201)
      .json({
        success: true,
        message: `user created successfully`,
        data: user,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `internal server error` });
  }
}

export async function loginUser(req, res) {
  try{
  const { userName, password } = req.body;

  // Checking if a user with the same username already exists
  const user = await userModel.findOne({ userName });
  const passwordMatch = await bcrypt.compare(password, user.password)

  if (user && passwordMatch) {
    res.json({
      _id: user._id,
      userName: user.userName,
      phoneNumber: user.phoneNumber,
    });
  }
  else{
    throw new Error('Passwords do not match')
  }

}catch(error){
    // If user login fails, send an error response
    console.log(error);
    return res.status(500).json({ message: `internal server error` });
  }
}
