import { Router } from "express";
import { unlikeImage } from "../../controllers/update/unlikeController.js";
import { authenticateUser } from "../../utils/middleware.js";

const router = Router();

router.put("/unlike", authenticateUser, unlikeImage);

export default router;

