import { Router } from "express";
import { createUser, loginUser ,  verifyOTP, resendOTPVerificationCode} from "../controllers/authController.js";
import bodyParser from 'body-parser';

const router = Router();
router.post("/signup", bodyParser.json(), createUser);
router.post("/login", loginUser)
router.post("/verifyOTP", verifyOTP)
router.post("/resendOTPVerificationCode", resendOTPVerificationCode)
export default router;

