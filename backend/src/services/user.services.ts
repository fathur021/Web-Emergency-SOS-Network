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
    
}
export { getUserByIdService };