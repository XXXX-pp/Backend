import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'


const app = express()
app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true}))
mongoose.set('strictQuery', false)

const DB_URL = "mongodb+srv://Master:Password4Mongodb@cluster0.cpjgko5.mongodb.net/?retryWrites=true&w=majority"

const newSchema=new mongoose.Schema({
  username: {
    type:String,
    required:true,
    unique: true
  },
  mobilenumber: {
    type:String,
    required:true,
    unique: true
  },
  password: {
    type:String,
    required:true
  },
})


const UserModel = mongoose.model("Users",newSchema)

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

async function connect () {
    try {
        await mongoose.connect(DB_URL)
        console.log("connected to database")
    } catch (error) {
        console.log(error)
    }
}

connect()

app.listen(8000, () => console.log("server running on port 8000"))
