import { Router } from "express";
import { getPosts } from "../../controllers/get/getPostController.js";
import { authenticateUser } from "../../utils/middleware.js";


const router = Router();
router.get("/get-posts", authenticateUser, getPosts);

export default router;

