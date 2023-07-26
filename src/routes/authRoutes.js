import { Router } from "express";
import {
  handleLogin,
  createUser,
  verifyUserOtp,
  sendUserOtp,
} from "../controllers/authController.js";


const router = Router();
router.post("/signup", createUser);
router.post("/login", handleLogin);
router.post("/verify-otp", verifyUserOtp)
router.post("/send-otp", sendUserOtp)

export default router;










// const authRoutes = new Router();
// authRoutes.post("/signup", asynHandler(createUser));
// authRoutes.post("/login", asynHandler(handleLogIn));

// export default authRoutes;
