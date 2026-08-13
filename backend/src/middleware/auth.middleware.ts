import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.utils.js';
import {AppError} from '../error/app.error.js';
import {User} from '../model/user.model.js';

async function authenticate(req:Request, res:Response, next:NextFunction){
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new AppError(401, 'Token tidak ditemukan, silakan login dulu');
    }
    
    const token = authHeader.split(' ')[1];
    if (!token) {
        throw new AppError(401, 'Token tidak valid');
    }
    const payload = verifyToken(token);

    const user = await User.findById(payload.sub);
    if (!user) {
        throw new AppError(401, 'Pengguna tidak ditemukan');
    }

    req.user = user;
    next();
}
function requireRole(...roles: ("user" | "volunteer" | "admin")[]) {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new AppError(403, 'Akses ditolak: Anda tidak memiliki izin untuk mengakses resource ini');
        }
        next();
    }
}
export { authenticate };