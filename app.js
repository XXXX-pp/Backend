import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import users from './model/userModel.js'
import asynHandler from 'express-async-handler'


connectDB()

// PACKAGE INITIALIZATIONS
const app = express()
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }))
  ;




// API ENDPOINTS
app.get('/', (req, res) => {
  res.send("API SERVER IS RUNNING")
});

app.get('/users', (req, res) => {
  users.find({})
    .then(function (users) {
      res.send(users)
    })
})

app.post('/signup', asynHandler(async (req, res) => {

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
}))



app.post('/login', asynHandler(async (req, res) => {
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
    throw new Error('Invalid User')
  }
}))





// STARTING THE SERVER
const PORT = 8000

app.listen(
  PORT,
  console.log(
    `SERVER RUNNING ON PORT ${PORT}`
  )
)
  ;