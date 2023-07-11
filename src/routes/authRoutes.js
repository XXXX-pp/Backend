import { Router } from "express";
import { createUser, loginUser } from "../controllers/authController.js";

const router = Router();
router.post("/signup", createUser);
router.post("/login", loginUser)
export default router;

// const authRoutes = new Router();
// authRoutes.post("/signup", asynHandler(createUser));
// authRoutes.post("/login", asynHandler(handleLogIn));

// export default authRoutes;
