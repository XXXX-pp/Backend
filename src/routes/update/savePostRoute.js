import { Router } from "express";
import { authenticateUser } from "../../utils/middleware.js";
import { savePost } from "../../controllers/update/savePostController.js";

const router = Router();

router.put("/save-post", authenticateUser, savePost);

export default router;

