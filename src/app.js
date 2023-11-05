import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";
import connectDB from "./config/db.js";
import bodyParser from "body-parser";
import dotenv from "dotenv"

import createUserRoute from "./routes/auth/createUserRoute.js";
import loginUserRoute from "./routes/auth/loginUserRoute.js";
import otpRoute from "./routes/auth/otpRoutes.js";
import newPostRoute from "./routes/post/newPostRoute.js";
import checkDetailsRoute from "./routes/auth/checkDetailsRoute.js";
import getPostRoute from "./routes/get/getPostRoute.js";
import getProfileRoute from "./routes/get/getProfileRoute.js"
import getYourPostRoute from "./routes/get/getYourPostRoute.js"
import likesUpdateRoute from "./routes/update/likesUpdateRoute.js"
import unlikesUpdateRoute from "./routes/update/unlikesUpdateRoute.js"
import deletePostRoute from "./routes/delete/deletePostRoute.js"
import getPostsByLikesRoute from "./routes/get/getPostsByLikesRoute.js";
import commentRoute from "./routes/post/commentRoute.js"
import getCommentRoute from "./routes/get/getCommentRoute.js"
import deleteCommentRoute from "./routes/delete/deleteCommentRoute.js"

dotenv.config();

connectDB();

const port = process.env.PORT;
const app = express();
const server = http.createServer(app);
app.use(bodyParser.json({ limit: '10mb' }));
const allowedOrigins = ['http://localhost:3000'];
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true, 
}));

app.use(morgan("dev"));
app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.get("/", (req, res) => {
  res.send("API SERVER IS RUNNING");
});


app.use("/user", createUserRoute, loginUserRoute, checkDetailsRoute);
app.use(otpRoute);
app.use(newPostRoute);
app.use(getPostRoute);
app.use(getProfileRoute)
app.use(getYourPostRoute)
app.use(likesUpdateRoute)
app.use(unlikesUpdateRoute)
app.use(deletePostRoute)
app.use(getPostsByLikesRoute)
app.use(commentRoute)
app.use(getCommentRoute)
app.use(deleteCommentRoute)


app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500).json({
    status: "false",
    message: err.message,
  });
});

server.listen(port, () => {
  console.log(`SERVER RUNNING ON PORT ${port}`);
});
