import { Router } from "express";
import { loginUser } from "../../controllers/auth/loginController.js";

const router = Router();
router.post("/login", loginUser);

export default router;