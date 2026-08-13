import express from "express";
import authRouter from "./auth.api.js"; // import router auth
import userRouter from "./user.api.js"; // import router user
const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API berhasil",
  });
});

// Semua route di auth.api.ts berprefix /auth
router.use("/auth", authRouter);
// Semua route di user.api.ts berprefix /user
router.use("/user", userRouter);

export default router;