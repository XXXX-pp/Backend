import { Router } from "express";
import { createUser, loginUser ,  verifyOTP, resendOTPVerificationCode} from "../controllers/authController.js";

const router = Router();
router.post("/signup", createUser);
router.post("/login", loginUser)
router.post("/verifyOTP", verifyOTP)
router.post("/resendOTPVerificationCode", resendOTPVerificationCode)
export default router;

