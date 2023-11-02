import { Router } from "express";
import { unlikeImage } from "../../controllers/update/unlikeController.js";

const router = Router();

router.put("/unlike", unlikeImage);

export default router;

