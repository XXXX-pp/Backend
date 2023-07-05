import { Router } from "express";
import { handleLogIn, createUser } from "../controllers/authController.js";
import asynHandler from "express-async-handler";

const router = Router();
router.post("/signup", createUser);
export default router;

const authRoutes = new Router();
authRoutes.post("/signup", asynHandler(createUser));
authRoutes.post("/login", asynHandler(handleLogIn));

// export default authRoutes;
