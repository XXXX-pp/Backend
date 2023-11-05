import { Router } from "express";
import { authenticateUser } from "../../utils/middleware.js";
import { deleteComment } from "../../controllers/delete/deleteCommentController.js";


const router = Router();
router.delete("/delete-comment", authenticateUser, deleteComment);

export default router;

