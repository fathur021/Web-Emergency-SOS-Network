export interface IUser {
    nama : string;
    email: string;
    password: string;
    role : "user" | "volunteer" | "admin";
    latitude : number;
    longitude : number;
    locationName : string;
    radius : number;
    isVolunteerActive : boolean;
}