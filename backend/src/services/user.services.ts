import { User } from "../model/user.model.js";
import { AppError } from "../error/app.error.js";
import { Sos } from "../model/sos.model.js";
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

async function getVolunteersService() {
  const volunteers = await User.find({
    role: "volunteer",
    latitude: { $ne: null },
    longitude: { $ne: null },
    isVolunteerActive: true,
  }).select("nama latitude longitude locationName radius isVolunteerActive");
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
export {
  getUserByIdService,
  getAllUsersService,
  updateLocationService,
  getVolunteersService,
  updateUserStatusServices,
  deleteUserServices
};
