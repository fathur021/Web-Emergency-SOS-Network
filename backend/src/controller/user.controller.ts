import type { Request, Response } from 'express';
import { getUserByIdService, getAllUsersService, updateLocationService, getVolunteersService } from '../services/user.services.js';

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

async function updateLocationController(req: Request, res: Response) {
    const userId = req.user!._id.toString();
    const { latitude, longitude, locationName, radius } = req.body;

    if (latitude == null || longitude == null) {
        return res.status(400).json({
            status: 'fail',
            message: 'Latitude dan longitude wajib diisi',
        });
    }

    const profile = await updateLocationService(userId, {
        latitude,
        longitude,
        locationName: locationName || "",
        radius: radius || 5000,
    });

    return res.status(200).json({
        status: 'success',
        message: 'Lokasi dan radius berhasil diperbarui',
        data: profile,
    });
}

async function getVolunteersController(req: Request, res: Response) {
    const volunteers = await getVolunteersService();
    return res.status(200).json({
        status: 'success',
        message: 'Berhasil mendapatkan data relawan',
        data: volunteers,
    });
}
export { getProfileController, getAllUsersController, updateLocationController, getVolunteersController };

