import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import http from "http";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import createUserRoute from "./routes/createUserRoute.js";
import loginUserRoute from "./routes/loginUserRoute.js";
import otpRoute from "./routes/otpRoutes.js";
import uploadRoute from "./routes/uploadFileRoute.js";



dotenv.config();

connectDB();


const port = process.env.PORT || 3000;
const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(authRoutes);
app.use(userRoutes);


// API ENDPOINTS
app.get("/", (req, res) => {
  res.send("API SERVER IS RUNNING");
});

app.use("/user", createUserRoute,loginUserRoute)
app.use(otpRoute)
app.use(uploadRoute)

// app.use(userRoutes)

app.use((req, res, next, err) => {
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
