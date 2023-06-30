import mongoose from 'mongoose'

const userSchema=new mongoose.Schema({

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
  
  
  const UserModel = mongoose.model("Users",userSchema)
  
  export default UserModel