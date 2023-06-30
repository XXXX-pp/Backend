import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import user from './model/userModel.js'


connectDB()

const app = express()
// PACKAGE INITIALIZATIONS
  app.use(cors())
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true}))
;




// API ENDPOINTS
  app.get('/', (req, res) => {
    res.send("API SERVER IS RUNNING")
  });

  app.get('/users', (req, res) => {
    user.find({})
    .then(function(users){
        res.send(users)
    })
  })

  app.post("/signup", async (req, res) => {
    const userDetails = req.body.user 
    const user = new user(userDetails)

    user.find({$or: [{username: userDetails.username}, {mobilenumber:userDetails.mobilenumber}]})
    .then(async (user) => {
    if (user) {
        console.log(user)
    } else {
        await newUser.save()
        res.json("User has been created")
    }
    })
  })
;


// STARTING THE SERVER
  const PORT = 5000

  app.listen(
    PORT,
    console.log(
      `SERVER RUNNING ON PORT ${PORT}`
    )
  )
;