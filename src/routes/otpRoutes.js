import { Router } from "express";
import { verifyUserOtp,sendUserOtp } from "../controllers/otpController.js";


const router = Router();
router.post("/send-otp", sendUserOtp)
router.post("/verify-otp", verifyUserOtp)

export default router;

