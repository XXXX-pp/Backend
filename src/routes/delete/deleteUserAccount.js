import { Router } from "express";
import { deleteUserAccount } from "../../controllers/delete/deleteUserAccountController.js";


const router = Router();
router.delete("/delete-account/",deleteUserAccount);

export default router;

