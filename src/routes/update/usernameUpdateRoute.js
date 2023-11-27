import { Router } from "express";
import { authenticateUser } from "../../utils/middleware.js";
import { updateUser } from "../../controllers/update/usernameUpdateController.js";

const router = Router();

router.put("/update-username", authenticateUser, updateUser);

export default router;