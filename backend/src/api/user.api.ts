import express from "express";
import {
  getAllUsersController,
  getProfileController,
  updateLocationController,
  getVolunteersController,
  updateUserStatusController,
  deleteUserController,
  createUserController,
  updateUserController,
  updateProfileController,
  updatePhotoController,
  changePasswordController,
} from "../controller/user.controller.js";
import { authenticate, requireRole } from "../middleware/auth.middleware.js";
import { uploadProfile } from "../utils/upload.utils.js"; 

const router = express.Router();

router.use(authenticate);

// ---- Route SPESIFIK dulu (wajib SEBELUM "/:id") ----
// Kalau route "/:id" ditaruh di atas, string seperti "profile"/"photo"
// akan dianggap sebagai parameter id -> Cast to ObjectId failed.
router.get("/profile", getProfileController);
router.patch("/profile", updateProfileController);          // <-- update nama
router.patch("/photo", uploadProfile.single("photo"), updatePhotoController); // <-- upload foto
router.patch("/password", changePasswordController);        // <-- ganti sandi
router.get("/volunteers", getVolunteersController);
router.patch("/location", updateLocationController);
router.get("/all", requireRole("admin"), getAllUsersController);

// ---- Lalu route dengan parameter dinamis ":id" ----
router.patch("/:id/status", requireRole("admin"), updateUserStatusController);
router.delete("/:id", requireRole("admin"), deleteUserController);
router.post("/", requireRole("admin"), createUserController);
router.patch("/:id", requireRole("admin"), updateUserController);

export default router;


