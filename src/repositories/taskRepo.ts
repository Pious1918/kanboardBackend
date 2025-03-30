import { ITask } from "../interfaces/task.interface";
import taskModel from "../models/taskModel";
import { BaseRepository } from "./baseRepo";


export class taskRepository extends BaseRepository<any> {

    constructor() {
        super(taskModel)
    }

    async createTask(taskdata: Partial<ITask>): Promise<ITask | null> {
        return await this.save(taskdata)
    }

    async getUserTasks(userid: string): Promise<ITask[]> {
        return await this.find({ creatorId: userid });
    }


    public async updateStatus(taskId: string, userId: string, status: string) {
        return await this.findOneAndUpdate(
            { _id: taskId, creatorId: userId },
            { $set: { status: status } }
        );
    }

    public async deleteTask(taskId: string, userId: string) {
        return await this.deleteOne({ _id: taskId, creatorId: userId });
    }

    async updateTask(taskId:string, updatedData:any) {
        return await this.updateById(taskId, updatedData);
      }
}