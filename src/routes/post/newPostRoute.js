import { Router } from "express";
import { upload } from "../../config/multerConfig.js";
import { createPost } from "../../controllers/post/newPostController.js";

const router = Router();

router.post("/new-post",upload.array("file"),createPost)

export default router;

