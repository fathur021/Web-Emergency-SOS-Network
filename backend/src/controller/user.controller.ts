import type { Request, Response } from 'express';
import { getUserByIdService, getAllUsersService } from '../services/user.services.js';

async function getProfileController(req: Request, res:Response){
    const userId = req.user!._id.toString(); // Use the authenticated user's ID
    const profile = await getUserByIdService(userId);

    return res.status(200).json({
        status: 'success',
        message: 'Berhasil mendapatkan profil pengguna',
        data: profile
    });
}

async function getAllUsersController( req: Request, res: Response) {
    const users = await getAllUsersService();
    return res.status(200).json({
        status: 'success',
        message: 'Berhasil mendapatkan semua pengguna',
        data: users
    });
}
export { getProfileController, getAllUsersController };

