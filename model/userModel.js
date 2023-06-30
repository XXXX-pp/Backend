import mongoose from 'mongoose'

// DATABASE SCHEMA AND MODEL
  const userSchema = new mongoose.Schema({
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
    }
  })
  const users = mongoose.model("users",userSchema)
;
 export default users