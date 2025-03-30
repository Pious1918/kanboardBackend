import mongoose, { Schema } from "mongoose";
import { ITask } from "../interfaces/task.interface";
import { taskStatus } from "../enums/taskstatus.enums";


const taskSchema:Schema<ITask> = new Schema({

    title:{
        type:String,
        required:true
    },
    description:{
        type:String
    },
    creatorId:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:taskStatus.TODO,
        required:true
    }
    
})

export default mongoose.model<ITask>('Tasks' , taskSchema)