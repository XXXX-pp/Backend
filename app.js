import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import UserModel from './model/userModel.js'


connectDB()

const app = express()

app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true}))






app.post("/signup", async (req, res) => {
  const user = req.body.user 
  const newUser = new UserModel(user)
  UserModel.find({$or: [{username: req.body.user.username}, {mobilenumber: req.body.user.mobilenumber}]})
  .then(async (user) => {
    if (user) {
      console.log(user)
    } else {
      await newUser.save()
      res.json("User has been created")
  }
  })
  
})



const PORT = 5000

app.listen(
  PORT,
  console.log(
    `Server running  on port ${PORT}`
  )
)
