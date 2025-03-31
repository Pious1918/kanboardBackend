import jwt, { SignOptions } from "jsonwebtoken";
import { IusePayload } from "../interfaces/user.interface";

export const generateToken = (payload: IusePayload, expiresIn: SignOptions["expiresIn"] = "1h"): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
        throw new Error("Secret is not defined in the .env file");
    }

    return jwt.sign(payload, secret, { expiresIn }); 
};







export const verifyToken = (token:string):IusePayload=>{
    const secret = process.env.JWT_SECRET!
    return jwt.verify(token, secret) as IusePayload

}