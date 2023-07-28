import { Router } from "express";
import { loginUser } from "../controllers/loginController.js";

const router = Router();
router.post("/login", loginUser);

export default router;