import { Schema, model } from 'mongoose'
// import bcrypt from 'bcryptjs'

// DATABASE SCHEMA AND MODEL
const userSchema = new Schema({

  firstName: {
    type: String, required: true,
    min: 4,
    max: 25
  },
  lastName: {
    type: String, required: true,
    min: 4,
    max: 25
  },
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

  Verified: {
    type: Boolean,
  },

  password: {
    type: String,
    required: true
  }
})

export const userModel = model("User", userSchema);