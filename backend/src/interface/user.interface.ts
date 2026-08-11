export interface IUser {
    nama : string;
    email: string;
    password: string;
    role : "user" | "volunteer" | "admin";
    latitude : number;
    longitude : number;
    isVolunteerActive : boolean;
}