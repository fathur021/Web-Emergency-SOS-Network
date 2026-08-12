
//input yang dikirim user ketika register
export interface IRegisterInput {
    nama : string;
    email : string;
    password : string;
}

//input yang dikirim user ketika login
export interface ILoginInput {
    email : string;
    password : string;
}

// isi TOken Jwt. Token ini yang di bawa client di setiap request
//agar server bisa mengenali siapa usernya
export interface IJwtPayload {
    sub : string; //subhect = id user ( dari -Id mongoDB)
    email: string;
    role : "user" | "volunteer" | "admin";
}


//Bentuk Response login dan register agar seragam
// { status, message, data: { token, user } }
export interface IAuthResponse {
    token : string;
    user : {
        id : string;
        nama : string;
        email : string;
        role : string;
    }
}