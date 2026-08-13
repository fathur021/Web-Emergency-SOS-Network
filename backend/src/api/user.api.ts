import express from "express";
import {getAllUsersController, getProfileController} from "../controller/user.controller.js";
import {authenticate, requireRole} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/profile", getProfileController);
router.get("/all", requireRole("admin"), getAllUsersController);

export default router;