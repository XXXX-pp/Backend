import { Router } from "express";
import { verifyUserOtp } from "../controllers/otpController.js";

const router = Router();

router.post("/verify-otp", verifyUserOtp)

export default router;

