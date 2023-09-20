import { Router } from "express";
import { checkDetails } from "../../controllers/auth/checkDetailsController.js";

const router = Router();
router.post("/checkDetails", checkDetails);

export default router;

