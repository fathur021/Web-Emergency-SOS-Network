import type {HydratedDocument} from 'mongoose';
import type {IUser} from '../interface/user.interface.js';

declare global {
    namespace Express {
        interface Request {
            user?:HydratedDocument<IUser>;
        }
    }
}

export {};