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
export { getUserByIdService, getAllUsersService };