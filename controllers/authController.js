import users from '../model/userModel.js'


export async function handleSignUp(req,res){
  
  // Extracting the username, mobilenumber, and password from the request body
  const { username, mobilenumber, password } = req.body
  
  // Checking if a user with the same username already exists
  const userExist = await users.findOne({ username })

  if (userExist) {
    // If a user with the same username exists, send an error response
    res.status(400)
    throw new Error('Username already exists')
  }

  // Creating a new user with the provided username, mobilenumber, and password
  const user = await users.create({ username, mobilenumber, password })
  
  if (user) {
    // If user creation is successful, send a JSON response with the user's information
    res.json({
      _id: user._id,
      username: user.username,
      mobilenumber: user.mobilenumber,
      password: user.password
    })
  }
  else {
    // If user creation fails, send an error response
    res.status(400)
    throw new Error('Invalid User')
  }
};
  
export async function handleLogIn(req, res){
  const {username , password} = req.body

  // Checking if a user with the same username already exists
  const user = await users.findOne({ username })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      mobilenumber: user.mobilenumber
      
    })
  }
  else {
    // If user creation fails, send an error response
    res.status(400)
    throw new Error('There was an error')
  }
};