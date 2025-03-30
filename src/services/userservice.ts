import { Itaskdata } from "../interfaces/task.interface";
import { IUser, IUserdata } from "../interfaces/user.interface";
import { taskRepository } from "../repositories/taskRepo";
import { userRepository } from "../repositories/userRepo";
import bcrypt from 'bcryptjs'


export class userService {

    private _userrepository: userRepository
    private _taskrepository: taskRepository

    constructor() {
        this._userrepository = new userRepository()
        this._taskrepository = new taskRepository()
    }

    async registerUser(userdata: IUser) {
        try {
            const existingUser = await this._userrepository.findbyEmail(userdata.email)

            if (existingUser) {
                return { success: false, message: "User already exists" }
            }

            const hashpassword = await bcrypt.hash(userdata.password, 10)
            const newUser = await this._userrepository.createUser({
                name: userdata.name,
                email: userdata.email,
                password: hashpassword
            })

            return { success: true, message: "User Registered successfully", data: newUser }

        } catch (error) {

        }
    }


    async loginuser(logindata: IUserdata) {
        try {
            const existingUser: any = await this._userrepository.findbyEmail(logindata.email)

            if (!existingUser) {
                console.log("invalid email")
                return { success: false, message: 'Invalid email' }
            }

            const validpassword = await bcrypt.compare(logindata.password, existingUser.password)
            if (!validpassword) {
                console.log("invalid password")
                return { success: false, message: "Invalid Password" }
            }

            const payload = {
                userId: existingUser._id,
                email: existingUser.email,
                name: existingUser.name
            }

            return { success: true, message: "Login Successfull", data: payload }

        } catch (error) {

        }
    }


    async addtask(taskdata: Itaskdata) {
        try {

            const newTask = await this._taskrepository.createTask(taskdata)
            return { success: true, message: "Task created successfully", task: newTask }
        } catch (error) {
            console.error("Error in addTask service:", error);
            throw new Error("Failed to create task");
        }
    }


    async getUsertasks(userid: any) {
        try {

            const usertasks = await this._taskrepository.getUserTasks(userid)
            return { success: true, message: "User tasks fetched successfully", usertasks }
        } catch (error) {
            console.error("Error in getusertask service:", error);
            throw new Error("Failed to create task");
        }
    }

     async updateTaskStatus(taskId: string, userId: string, status: string) {
        return await this._taskrepository.updateStatus(taskId, userId, status);
    }

    public async deleteTask(taskId: string, userId: string) {
        return await this._taskrepository.deleteTask(taskId, userId);
    }


    public async updateTask (taskId:string, updatedData:any) {
        return await this._taskrepository.updateTask(taskId, updatedData);
    }
}