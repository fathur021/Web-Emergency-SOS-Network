import type { Request, Response } from 'express';
import { getUserByIdService } from '../services/user.services.js';

async function getProfileController(req: Request, res:Response){
    const userId = req.user!._id.toString(); // Use the authenticated user's ID
    const profile = await getUserByIdService(userId);

    return res.status(200).json({
        status: 'success',
        message: 'Berhasil mendapatkan profil pengguna',
        data: profile
    });
}

export { getProfileController };

