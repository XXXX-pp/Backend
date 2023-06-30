import { Router } from "express";
import { handleLogIn, handleSignUp } from "../controllers/authController.js";
import asynHandler from 'express-async-handler'


const authRoutes = new Router();

authRoutes.post('/signup',asynHandler(handleSignUp))

authRoutes.post('/login',asynHandler(handleLogIn))

export default authRoutes;