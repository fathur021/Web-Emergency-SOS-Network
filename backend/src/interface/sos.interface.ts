import { Types } from "mongoose"    

export interface ISos {
    userId: Types.ObjectId,
    latitude: number,
    longitude:number,
    description:string,
    image?: string,
    status: "pending" | "in_progres" | "resolved" | "rejected";
    volunteerId?: Types.ObjectId

}