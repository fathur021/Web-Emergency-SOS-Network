import { User } from "../model/user.model.js";
import { AppError } from "../error/app.error.js";
import { Sos } from "../model/sos.model.js";
import bcrypt from "bcryptjs";
import type {
  ICreateUserInput,
  IUpdateUserInput,
} from "../interface/user.interface.js";

async function getUserByIdService(userId: string) {
  const user = await User.findById(userId).select("-password"); // Exclude password field
  if (!user) {
    throw new AppError(404, "Pengguna tidak ditemukan");
  }
  return user;
}
async function getAllUsersService() {
  const users = await User.find().select("-password"); // Exclude password field
  if (!users || users.length === 0) {
    throw new AppError(404, "Tidak ada pengguna ditemukan");
  }
  return users;
}
async function updateLocationService(
  userId: string,
  data: {
    latitude: number;
    longitude: number;
    locationName: string;
    radius: number;
  },
) {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      latitude: data.latitude,
      longitude: data.longitude,
      locationName: data.locationName,
      radius: data.radius,
    },
    { new: true },
  ).select("-password");
  if (!user) {
    throw new AppError(404, "Pengguna tidak ditemukan");
  }
  return user;
}

async function updateUserStatusServices(
  userId: string,
  isVolunteerActive: boolean,
) {
  const existing = await User.findById(userId);
  if (!existing) {
    throw new AppError(404, "Pengguna tidak ditemukan");
  }
  if (existing.role !== "volunteer") {
    throw new AppError(400, "Hanya relawan yang bisa dinonaktifkan/diaktifkan");
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { isVolunteerActive },
    { new: true },
  ).select("-password");
  return user;
}

async function toggleMyStatusService(userId: string) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "Pengguna tidak ditemukan");
  }
  if (user.role !== "volunteer") {
    throw new AppError(400, "Hanya relawan yang bisa mengubah status aktif");
  }

  const updated = await User.findByIdAndUpdate(
    userId,
    { isVolunteerActive: !user.isVolunteerActive },
    { new: true },
  ).select("-password");
  return updated;
}

async function getVolunteersService() {
  const volunteers = await User.find({
    role: "volunteer",
    latitude: { $ne: null },
    longitude: { $ne: null },
    isVolunteerActive: true,
  }).select("nama photo latitude longitude locationName radius isVolunteerActive");
  return volunteers;
}

async function deleteUserServices(userId: string) {
  const existing = await User.findById(userId);
  if (!existing) {
    throw new AppError(404, "Pengguna tidak ditemukan");
  }
  if (existing.role === "admin") {
    throw new AppError(403, "Akun admin tidak bisa dihapus");
  }
  // SOS yang sedang dia tangani → lepas kembali jadi pending
  await Sos.updateMany(
    { volunteerId: userId, status: "in_progress" },
    { $set: { status: "pending", volunteerId: null } },
  );
  await Sos.deleteMany({ userId });
  await User.findByIdAndDelete(userId);
  return { message: "Pengguna berhasil dihapus" };
}

async function createUserService(input: ICreateUserInput) {
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw new AppError(409, "Email sudah terdaftar"); // 409 = Conflict
  }
  const hashedPassword = await bcrypt.hash(input.password, 10);
  const user = await User.create({
    nama: input.nama,
    email: input.email,
    password: hashedPassword,
    role: input.role,
    isVolunteerActive: input.role === "volunteer",
  });
  const safeUser = await User.findById(user._id).select("-password");
  return safeUser;
}

async function updateUserAdminService(userId: string, input: IUpdateUserInput) {
  // 1. Pastikan user ada & bukan admin
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "Pengguna tidak ditemukan");
  }
  if (user.role === "admin") {
    throw new AppError(403, "Akun admin tidak bisa diedit"); // sama seperti aturan hapus
  }

  // 2. Kalau email diganti, pastikan tidak dipakai orang lain (kecuali dirinya sendiri)
  if (input.email && input.email !== user.email) {
    const dup = await User.findOne({ email: input.email });
    if (dup) {
      throw new AppError(409, "Email sudah terdaftar");
    }
  }

  // 3. Hash password HANYA kalau field password benar-benar diisi
  let hashedPassword: string | undefined;
  if (input.password) {
    hashedPassword = await bcrypt.hash(input.password, 10);
  }

  // 4. Kumpulkan field yang mau di-update ke satu objek
  const updateData: Record<string, unknown> = {};
  if (input.nama) updateData.nama = input.nama;
  if (input.email) updateData.email = input.email;
  if (input.role) updateData.role = input.role;
  if (hashedPassword) updateData.password = hashedPassword;

  // 5. Sinkronkan status relawan dengan role terbaru:
  //    jadi relawan -> aktif, bukan lagi relawan -> matikan
  updateData.isVolunteerActive =
    input.role === undefined
      ? user.isVolunteerActive
      : input.role === "volunteer";

  // 6. Simpan & kembalikan versi TANPA password
  const updated = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-password");
  return updated;
}

async function updateProfileServices(userId: string, nama: string) {
  const user = await User.findByIdAndUpdate(
    userId,
    { nama },
    { new: true },
  ).select("-password");
  if (!user) {
    throw new AppError(404, "Pengguna tidak ditemukan");
  }
  return user;
}
async function updatePhotoServices(userId: string, photoPath: string) {
  const user = await User.findByIdAndUpdate(
    userId,
    { photo: photoPath },
    { new: true },
  ).select("-password");
  if (!user) {
    throw new AppError(404, "Pengguna tidak ditemukan");
  }
  return user;
}

async function changePasswordServices(
  userId: string,
  oldPassword: string,
  newPassword: string,
) {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError(404, "Pengguna tidak ditemukan");
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new AppError(400, "Kata sandi lama salah");
  }
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();

  const safeUser = await User.findById(userId).select("-password");
  return safeUser;
}
export {
  getUserByIdService,
  getAllUsersService,
  updateLocationService,
  getVolunteersService,
  updateUserStatusServices,
  toggleMyStatusService,
  deleteUserServices,
  createUserService,
  updateUserAdminService,
  updateProfileServices,
  updatePhotoServices,
  changePasswordServices,
};
