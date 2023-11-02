import { Router } from "express";
import { authenticateUser } from "../../utils/middleware.js";
import { deletePost } from "../../controllers/delete/deletePostController.js";


const router = Router();
router.delete("/delete-post/:postId", authenticateUser, deletePost);

export default router;

