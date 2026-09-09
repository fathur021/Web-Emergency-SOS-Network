export interface IUser {
    nama : string;
    email: string;
    password: string;
    role : "user" | "volunteer" | "admin";
    tokenVersion : number;
    latitude : number;
    longitude : number;
    locationName : string;
    radius : number;
    isVolunteerActive : boolean;
    photo : string;
}

export interface ICreateUserInput{
    nama :string,
    email:string,
    password: string,
    role : "user" | "volunteer" | "admin";
}

//input yang dikirim admin ketika MENGUBAH data user (semuanya opsional)
export interface IUpdateUserInput {
    nama? : string;
    email? : string;
    role? : "user" | "volunteer" | "admin";
    password? : string;
}