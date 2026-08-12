import express from "express";
import authRouter from "./auth.api.js"; // import router auth

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API berhasil",
  });
});

// Semua route di auth.api.ts berprefix /auth
router.use("/auth", authRouter);

export default router;