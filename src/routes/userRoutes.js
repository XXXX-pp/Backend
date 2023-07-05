import { Router } from "express";
import handleGetUsers from "../controllers/userController.js";

const userRoutes = new Router();

userRoutes.get('/users', handleGetUsers)

export default userRoutes;