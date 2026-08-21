import express from "express";
import {
  getAllUsersController,
  getProfileController,
  updateLocationController,
  getVolunteersController,
  updateUserStatusController,
  deleteUserController
} from "../controller/user.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/profile", getProfileController);
router.get("/volunteers", getVolunteersController);
router.patch("/location", updateLocationController);
router.get("/all", requireRole("admin"), getAllUsersController);
router.patch("/:id/status", requireRole("admin"), updateUserStatusController);
router.delete("/:id", requireRole("admin"), deleteUserController);
export default router;


