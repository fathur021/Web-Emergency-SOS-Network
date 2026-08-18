import {User} from "../model/user.model.js";
import {AppError} from "../error/app.error.js";

async function getUserByIdService(userId: string) {
    const user = await User.findById(userId).select('-password'); // Exclude password field
    if (!user) {
        throw new AppError(404, 'Pengguna tidak ditemukan');
    }
    return user;
}
async function getAllUsersService(){
    const users = await User.find().select('-password'); // Exclude password field
    if(!users || users.length === 0){
        throw new AppError(404, 'Tidak ada pengguna ditemukan');
    }
    return users;
}
async function updateLocationService(userId: string, data: { latitude: number; longitude: number; locationName: string; radius: number }) {
    const user = await User.findByIdAndUpdate(
        userId,
        { latitude: data.latitude, longitude: data.longitude, locationName: data.locationName, radius: data.radius },
        { new: true }
    ).select('-password');
    if (!user) {
        throw new AppError(404, 'Pengguna tidak ditemukan');
    }
    return user;
}

async function getVolunteersService() {
    const volunteers = await User.find({
        role: "volunteer",
        latitude: { $ne: null },
        longitude: { $ne: null },
    }).select('nama latitude longitude locationName radius isVolunteerActive');
    return volunteers;
}

export { getUserByIdService, getAllUsersService, updateLocationService, getVolunteersService };