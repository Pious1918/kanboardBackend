import { IUser } from "../interfaces/user.interface";
import userModel from "../models/userModel";
import { BaseRepository } from "./baseRepo";


export class userRepository extends BaseRepository<any> {

    constructor() {
        super(userModel)
    }


    async findbyEmail(email: string): Promise<IUser | null> {
        return await this.findOne({ email })
    }

    async createUser(userdata: Partial<IUser>): Promise<IUser | null> {
        return await this.save(userdata)
    }

    async getUserProfile(userid: any): Promise<IUser | null> {
        return await this.findOne(userid)
    }

    public async updateName(userId: string, name: string) {
        return await this.findOneAndUpdate(
            { _id: userId },
            { $set: { name: name } }
        );
    }

    public async updatenewImage(userId: string, imageurl: string) {
        return await this.findOneAndUpdate(
            { _id: userId },
            { $set: { profileImage: imageurl } }
        );
    }

}