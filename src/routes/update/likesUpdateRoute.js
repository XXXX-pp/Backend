import { Router } from "express";
import { updateLikes } from "../../controllers/update/updateLikesController.js";
import { authenticateUser } from "../../utils/middleware.js";

const router = Router();

router.put("/update-likes", authenticateUser, updateLikes);

export default router;

