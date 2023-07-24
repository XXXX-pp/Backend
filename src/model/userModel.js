import {Schema, model } from 'mongoose'

// DATABASE SCHEMA AND MODEL
  const userSchema = new Schema({

    userName: {
    type:String,
    required:true,
    },

    email: {
      type: String,
      required: true,
    },
  
    Verified: {
      type: Boolean,
    },

    phoneNumber: {
    type:String,
    required:true,
    },

    password: {
    type:String,
    required:true
    }
  })

export const userModel = model("User", userSchema);