import {Schema, model } from 'mongoose'

// DATABASE SCHEMA AND MODEL
  const userSchema = new Schema({

    userName: {
    type:String,
    required:true,
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