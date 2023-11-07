import { Router } from "express";
import { authenticateUser } from "../../utils/middleware.js";
import { deletePost } from "../../controllers/delete/deletePostController.js";


const router = Router();
router.delete("/delete-post/:postId", deletePost);

export default router;

