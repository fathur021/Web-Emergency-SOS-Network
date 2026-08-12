import express from "express";
import { registerController, loginController } from "../controller/auth.controller.js";

const router = express.Router();

// Route lengkap: POST /api/auth/register  dan  POST /api/auth/login
router.post("/register", registerController);
router.post("/login", loginController);

export default router;
