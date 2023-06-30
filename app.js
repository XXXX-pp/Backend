import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'


connectDB()

// PACKAGE INITIALIZATIONS
  const app = express()
  app.use(authRoutes)
  app.use(userRoutes)
  app.use(cors())
  app.use(express.json());
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true }))
;




// API ENDPOINTS
  app.get('/', (req, res) => {
    res.send("API SERVER IS RUNNING")
  });

  app.get('/users')
  app.post('/signup')
  app.post('/login')
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