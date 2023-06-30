import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import users from './model/userModel.js'
import mongoose from 'mongoose'



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
    users.find({})
    .then(function(users){
        res.send(users)
    })
  })

  app.post("/signup", async (req, res) => {
    const {username,mobilenumber,password} = req.body.user
    
    // Check if user is already registerd
    // Create a mew user 
  })

  app.post('/signin', async (req, res) => {
    
  })




;


// STARTING THE SERVER
  const PORT = 8000

  app.listen(
    PORT,
    console.log(
      `SERVER RUNNING ON PORT ${PORT}`
    )
  )
;