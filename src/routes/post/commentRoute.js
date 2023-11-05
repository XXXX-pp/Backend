import { Router } from "express";
import { authenticateUser } from "../../utils/middleware.js";
import { postComment } from "../../controllers/post/commentController.js";

const router = Router();

router.post("/comment", authenticateUser, postComment);

export default router;

