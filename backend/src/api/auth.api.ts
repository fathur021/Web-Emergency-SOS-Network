import express from "express";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { registerController, loginController } from "../controller/auth.controller.js";

const router = express.Router();

// Route lengkap: POST /api/auth/register  dan  POST /api/auth/login
router.post("/register", authLimiter, registerController);
router.post("/login", authLimiter, loginController);

export default router;
