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

app.post('/signup', asynHandler( async (req, res) => {
  console.log(req)

  const { username, mobilenumber, password } = req.body

  const userExist = await users.findOne({ username })

  if(userExist){
    res.status(400)
    throw new Error('Username already exist')
  }

  const user = await users.create({ username, mobilenumber, password })

  if(user){
    res.json({
      _id: user._id,
      username: user.username,
      mobilenumber: user.mobilenumber,
      password: user.password
    })
  }
  else {
    res.status(400)
    throw new Error('Invalid User')
  }
}))


app.post('/signin')



// STARTING THE SERVER
const PORT = 8000

app.listen(
  PORT,
  console.log(
    `SERVER RUNNING ON PORT ${PORT}`
  )
)
;