import { Schema, model } from 'mongoose'

// DATABASE SCHEMA AND MODEL
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean, 
    default:false
  },
  password: {
    type: String,
    required: true
  },
  posts:{
    type: Array,
  },
  postYouLiked:{
    type: Array,
  },
  postsYouSaved:{
    type: Array,
  },
  totalNoOfLikes: {
    type: String
  }
}, {timestamps:true})

export const UserModel = model("User", userSchema);