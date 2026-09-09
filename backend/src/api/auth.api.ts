import express from "express";
import { registerController, loginController, logoutController } from "../controller/auth.controller.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route lengkap: POST /api/auth/register  dan  POST /api/auth/login
router.post("/register", authLimiter, registerController);
router.post("/login", authLimiter, loginController);
router.post("/logout", authenticate, logoutController);

export default router;
