import { Router } from "express";
import { authenticateUser } from "../../utils/middleware.js";
import { getComments } from "../../controllers/get/getCommentController.js";


const router = Router();
router.get("/getcomment/:postId", getComments);

export default router;