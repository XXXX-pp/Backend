import mongoose from "mongoose";

// CONNECTING TO DATABASE
const connectDB = async () => {
  try {
    const DB_URL = process.env.MONGO_URL;
    const conn = await mongoose.connect(DB_URL);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};
export default connectDB;
