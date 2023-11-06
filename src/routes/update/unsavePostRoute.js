import { Router } from "express";
import { authenticateUser } from "../../utils/middleware.js";
import { unSavePost } from "../../controllers/update/savePostController.js";

const router = Router();

router.put("/unsave-post", authenticateUser, unSavePost);

export default router;

