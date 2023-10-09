import { Router } from "express";
import { upload } from "../../config/multerConfig.js";
import { createPost } from "../../controllers/post/newPostController.js";

const router = Router();

router.post("/new-post",upload.array("files", 2),createPost)

export default router;

