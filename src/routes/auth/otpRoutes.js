import { Router } from "express";
import { resendOtp, verifyUserOtp } from "../../controllers/auth/otpController.js";

const router = Router();

router.post("/verify-otp", verifyUserOtp)

router.post('/resend-otp', resendOtp)

export default router;

