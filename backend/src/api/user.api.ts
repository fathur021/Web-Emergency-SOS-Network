import express from "express";
import {getProfileController} from "../controller/user.controller.js";
import {authenticate} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/profile", getProfileController);

export default router;