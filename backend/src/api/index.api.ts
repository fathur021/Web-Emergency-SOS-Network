import express from "express";
import authRouter from "./auth.api.js"; // import router auth
import userRouter from "./user.api.js"; // import router user
import sosRouter from "./sos.api.js"; // import router sos
import { apiLimiter } from "../middleware/rateLimit.middleware.js";


const router = express.Router();

router.use(apiLimiter);

router.get("/", (req, res) => {
  res.json({
    message: "API berhasil",
  });
});

// Semua route di auth.api.ts berprefix /auth
router.use("/auth", authRouter);
// Semua route di user.api.ts berprefix /user
router.use("/user", userRouter);
// Semua route di sos.api.ts berprefix /sos
router.use("/sos", sosRouter);

export default router;