import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import createUserRoute from "./routes/auth/createUserRoute.js";
import loginUserRoute from "./routes/auth/loginUserRoute.js";
import otpRoute from "./routes/auth/otpRoutes.js";
import newPostRoute from "./routes/post/newPostRoute.js";
import checkDetailsRoute from "./routes/auth/checkDetailsRoute.js"


dotenv.config();

connectDB();


const port = process.env.PORT 
const app = express();
const server = http.createServer(app);

app.use(cors({
  origin: 'http://localhost:3000',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));
app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API ENDPOINTS
app.get("/", (req, res) => {
  res.send("API SERVER IS RUNNING");
});

app.use("/user", createUserRoute,loginUserRoute,checkDetailsRoute)
app.use(otpRoute)
app.use(newPostRoute)


app.use((err, req, res, next) => {
   res.locals.message = err.message;
   res.locals.error = req.app.get("env") === "development" ? err : {};
   res.status(err.status || 500).json({
     status: "false",
     message: err.message,
   });
})

server.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT ${port}`);
});
