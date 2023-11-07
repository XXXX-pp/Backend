import { Router } from "express";
import { authenticateUser } from "../../utils/middleware.js";
import { getProfile } from "../../controllers/get/getProfileController.js";


const router = Router();
router.get("/get-profile", authenticateUser, getProfile);

export default router;