import { Router } from "express";
import { authenticateUser } from "../../utils/middleware.js";
import { getPostsByLikes } from "../../controllers/get/getPostController.js";


const router = Router();
router.get("/get-trends", getPostsByLikes);

export default router;