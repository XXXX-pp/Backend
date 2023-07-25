import {Schema, model } from 'mongoose'

// DATABASE SCHEMA AND MODEL
  const userSchema = new Schema({

    username: {
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

    password: {
    type:String,
    required:true
    }
  })

export const userModel = model("User", userSchema);