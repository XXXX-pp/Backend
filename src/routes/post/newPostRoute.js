import { Router } from "express";
import { createPost } from "../../controllers/post/newPostController.js";
import { authenticateUser } from "../../utils/middleware.js";
import upload from "../../config/multerConfig.js";

const router = Router();

router.post("/new-post", upload.array("files", 2), authenticateUser, createPost);

export default router;

