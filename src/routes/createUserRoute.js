import { Router } from "express";
import {
  createUser,
  verifyUserOtp,
  sendUserOtp,
} from "../controllers/signupController.js";


const router = Router();
router.post("/signup", createUser);
router.post("/send-otp", sendUserOtp)
router.post("/verify-otp", verifyUserOtp)

export default router;

