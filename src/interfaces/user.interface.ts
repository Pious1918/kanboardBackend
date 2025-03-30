
export interface IUser{

    
    name: string;
    email: string;
    password: string;
    profileImage?:string
}

export interface IUserdata{
    email:string
    password:string
}

export interface IusePayload{
    _id?:any,
    userId:string,
    name:string,
    email:string
}



import { Request } from "express";

export interface AuthenticatedRequest extends Request {
    user?:IusePayload
}
