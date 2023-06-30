import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    const DB_URL= 'mongodb+srv://'+('admin-xxxx')+':'+('xxxx2023')+('@xxxx-database.xt8zh0z.mongodb.net/')+('xxxx-database')+'?retryWrites=true&w=majority'

    const conn = await mongoose.connect(DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`Error: ${error.message}`)
    process.exit(1)
  }
}

export default connectDB