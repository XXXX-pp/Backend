import { Router } from "express";
import { createUser } from "../../controllers/auth/signupController.js";

const router = Router();
router.post("/signup", createUser);

export default router;

