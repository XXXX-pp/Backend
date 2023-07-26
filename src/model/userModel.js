import { Schema, model } from 'mongoose'

// DATABASE SCHEMA AND MODEL
const userSchema = new Schema({
 
  userName: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  isVerified: {
    type: Boolean, default:false
  },

  password: {
    type: String,
    required: true
  }
}, {timestamps:true})

export const UserModel = model("User", userSchema);