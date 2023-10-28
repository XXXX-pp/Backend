import { Router } from "express";
import { updateLikes } from "../../controllers/update/updateLikesController.js";

const router = Router();

router.put("/update-likes", updateLikes);

export default router;

