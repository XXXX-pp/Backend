import { Router } from "express";
import { getPostById } from "../../controllers/get/getPostController.js";
import { authenticateUser } from "../../utils/middleware.js";


const router = Router();
router.get("/select-posts/:postId", getPostById);

export default router;

