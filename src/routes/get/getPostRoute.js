import { Router } from "express";
import { getPosts } from "../../controllers/get/getPostController.js";

const router = Router();
router.get("/get-posts", getPosts);

export default router;

