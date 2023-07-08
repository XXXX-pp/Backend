import { Router } from "express";
import { handleLogIn, createUser, verifyOTP, resendOTPVerificationCode } from "../controllers/authController.js";


const router = Router();
router.post("/signup", createUser);
router.post("/verifyOTP", verifyOTP)
router.post("/resendOTPVerificationCode", resendOTPVerificationCode)
export default router;










// const authRoutes = new Router();
// authRoutes.post("/signup", asynHandler(createUser));
// authRoutes.post("/login", asynHandler(handleLogIn));

// export default authRoutes;
