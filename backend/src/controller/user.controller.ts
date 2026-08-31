import type { Request, Response } from "express";
import {
  getUserByIdService,
  getAllUsersService,
  updateLocationService,
  getVolunteersService,
  updateUserStatusServices,
  deleteUserServices,
  updateUserAdminService,
  createUserService,
  updateProfileServices,
  updatePhotoServices,
  changePasswordServices,
} from "../services/user.services.js";
import {
  createUserSchema,
  updateUserSchema,
  updateProfileSchema,
  changePasswordSchema,
  validateWith,
} from "../validation/auth.validation.js";
import type { ICreateUserInput, IUpdateUserInput } from "../interface/user.interface.js";
import { User } from "../model/user.model.js";
import { deleteUploadedFile } from "../utils/upload.utils.js";

async function getProfileController(req: Request, res: Response) {
  const userId = req.user!._id.toString(); // Use the authenticated user's ID
  const profile = await getUserByIdService(userId);

  return res.status(200).json({
    status: "success",
    message: "Berhasil mendapatkan profil pengguna",
    data: profile,
  });
}

async function getAllUsersController(req: Request, res: Response) {
  const users = await getAllUsersService();
  return res.status(200).json({
    status: "success",
    message: "Berhasil mendapatkan semua pengguna",
    data: users,
  });
}

async function updateLocationController(req: Request, res: Response) {
  const userId = req.user!._id.toString();
  const { latitude, longitude, locationName, radius } = req.body;

  if (latitude == null || longitude == null) {
    return res.status(400).json({
      status: "fail",
      message: "Latitude dan longitude wajib diisi",
    });
  }

  const profile = await updateLocationService(userId, {
    latitude,
    longitude,
    locationName: locationName || "",
    radius: radius || 5000,
  });

  return res.status(200).json({
    status: "success",
    message: "Lokasi dan radius berhasil diperbarui",
    data: profile,
  });
}

async function updateUserStatusController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const { isVolunteerActive } = req.body;

  if (typeof isVolunteerActive !== "boolean") {
    return res.status(400).json({
      status: "fail",
      message: "isVolunteerActive wajib diisi (true/false)",
    });
  }

  const user = await updateUserStatusServices(id, isVolunteerActive);

  return res.status(200).json({
    status: "success",
    message: "Status relawan berhasil diperbarui",
    data: user,
  });
}

async function getVolunteersController(req: Request, res: Response) {
  const volunteers = await getVolunteersService();
  return res.status(200).json({
    status: "success",
    message: "Berhasil mendapatkan data relawan",
    data: volunteers,
  });
}
async function deleteUserController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;
  const result = await deleteUserServices(id);
  return res.status(200).json({
    status: "success",
    message: result.message,
  });
}

// ---- POST /api/user ----
// Admin membuat akun baru lengkap dengan rolenya.
async function createUserController(req: Request, res: Response) {
  // Gagal validasi -> validateWith melempar AppError 400 otomatis
  const input = await validateWith<ICreateUserInput>(
    createUserSchema,
    req.body,
  );

  const user = await createUserService(input);

  // 201 = Created (pola sama seperti registerController)
  return res.status(201).json({
    status: "success",
    message: "Pengguna berhasil ditambahkan",
    data: user,
  });
}

// ---- PATCH /api/user/:id ----
// Admin mengubah sebagian data pengguna (nama/email/role/password).
async function updateUserController(
  req: Request<{ id: string }>,
  res: Response,
) {
  const { id } = req.params;

  // Gagal validasi -> validateWith melempar AppError 400 otomatis
  const input = await validateWith<IUpdateUserInput>(
    updateUserSchema,
    req.body,
  );

  const user = await updateUserAdminService(id, input);

  return res.status(200).json({
    status: "success",
    message: "Data pengguna berhasil diperbarui",
    data: user,
  });
}

async function updateProfileController(req: Request, res: Response) {
  const userId = req.user!._id.toString();
  const input = await validateWith<{ nama: string }>(
    updateProfileSchema,
    req.body,
  );
  const profile = await updateProfileServices(userId, input.nama);

  return res.status(200).json({
    status: "success",
    message: "Profile Berhasil di Update",
    data: profile,
  });
}
async function updatePhotoController(req:Request, res:Response){
  const userId = req.user!._id.toString();
  if(!req.file){
    return res.status(400).json({
      status:"fail",
      message:"File foto wajib di unggah"
    })
  }

  // Ambil foto lama dari user (sebelum diganti) untuk dihapus dari disk
  const existing = await User.findById(userId).select("photo");
  deleteUploadedFile(existing?.photo);

  const photoPath = `/uploads/${req.file.filename}`;
  const profile = await updatePhotoServices(userId, photoPath);

  return res.status(200).json({
    status: "Success",
    message:"Foto berhasil di perbarui",
    data:profile,
  })
}

async function changePasswordController(req:Request, res:Response){
  const userId = req.user!._id.toString();
  const input = await validateWith<{oldPassword:string, newPassword:string}>(changePasswordSchema, req.body);

  const profile = await changePasswordServices(
    userId, input.oldPassword, input.newPassword
  )
  return res.status(200).json({
    status: "Success",
    message: "Password Berhasil di ganti",
    data: profile
  })
}

export {
  getProfileController,
  getAllUsersController,
  updateLocationController,
  getVolunteersController,
  updateUserStatusController,
  deleteUserController,
  createUserController,
  updateUserController,
  updateProfileController,
  updatePhotoController,
  changePasswordController
};
