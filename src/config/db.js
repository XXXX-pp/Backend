import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 5;
  let currentRetry = 0;

  const connectWithRetry = async () => {
    try {
      const DB_URL = process.env.MONGO_URL;
      const conn = await mongoose.connect(DB_URL);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.error(`Error: ${error.message}`);

      // Retry connection if the maximum number of retries hasn't been reached
      if (currentRetry < maxRetries) {
        console.log(`Retrying connection... (Attempt ${currentRetry + 1}/${maxRetries})`);
        currentRetry++;
        // Wait for a moment before retrying (you can adjust the delay as needed)
        setTimeout(() => connectWithRetry(), 5000);
      } else {
        console.error(`Max retries reached. Unable to connect to MongoDB.`);
        process.exit(1);
      }
    }
  };

  // Start the initial connection attempt
  await connectWithRetry();
};

export default connectDB;

