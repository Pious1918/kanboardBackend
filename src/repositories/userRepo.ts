import { IUser } from "../interfaces/user.interface";
import userModel from "../models/userModel";
import { BaseRepository } from "./baseRepo";


export class userRepository extends BaseRepository<any>{

    constructor(){
        super(userModel)
    }


    async findbyEmail(email:string): Promise<IUser | null>{
        return await this.findOne({email})
    }

    async createUser(userdata:Partial<IUser>): Promise<IUser | null>{
        return await this.save(userdata)
    }
}