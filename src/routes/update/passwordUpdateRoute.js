import { Router } from "express";
import { authenticateUser } from "../../utils/middleware.js";
import { updatePassword } from "../../controllers/update/updatePasswordController.js";

const router = Router();

router.put("/password-update", authenticateUser, updatePassword);

export default router;