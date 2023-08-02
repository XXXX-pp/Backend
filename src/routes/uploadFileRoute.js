import { Router } from "express";
import { uploadFile } from "../controllers/uploadController.js";

import { upload } from "../config/multerConfig.js";


const router = Router();

router.post("/upload",upload.single("file"),uploadFile)

export default router;

