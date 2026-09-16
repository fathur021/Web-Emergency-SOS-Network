import express from "express";
import { registerController, loginController, logoutController } from "../controller/auth.controller.js";
import { authLimiter } from "../middleware/rateLimit.middleware.js";
import { authenticate } from "../middleware/auth.middleware.js";
import {signToken} from "../utils/jwt.utils.js";


const router = express.Router();

// Route lengkap: POST /api/auth/register  dan  POST /api/auth/login
router.post("/register", authLimiter, registerController);
router.post("/login", authLimiter, loginController);
router.post("/logout",authLimiter, authenticate, logoutController);

router.get("/token", authenticate, async (req, res) => {
  const token = signToken({
    sub: req.user!._id.toString(),
    email: req.user!.email,
    role: req.user!.role as "user" | "volunteer" | "admin",
    tokenVersion: req.user!.tokenVersion,
  });
  res.json({ status: "success", token });
});


export default router;
