import mongoose from 'mongoose'

import bcrypt from 'bcryptjs'

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

  

userSchema.methods.matchPassword = async function (enteredPassword) {
  // Compare the enteredPassword with the stored hashed password using bcrypt.compare()
  return await bcrypt.compare(enteredPassword, this.password)
}





userSchema.pre('save', async function (next) {
  // Check if the password field is modified
  if (!this.isModified('password')) {
    next(); // If not modified, proceed to the next middleware or save operation
  }

  // Generate a salt using bcrypt with a cost factor of 10
  const salt = await bcrypt.genSalt(10);

  // Hash the password using the generated salt
  this.password = await bcrypt.hash(this.password, salt);

  // Call the next middleware or save operation
  next();
});

  const users = mongoose.model("users",userSchema)


 export default users