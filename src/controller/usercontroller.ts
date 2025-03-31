import { Request, Response } from "express";
import { AuthenticatedRequest, IUser, IUserdata } from "../interfaces/user.interface";
import { userService } from "../services/userservice";
import { StatusCode } from "../enums/statuscode.enums";
import { generateToken } from "../utils/jwtHelper";
import { Itaskdata } from "../interfaces/task.interface";
import { generatepresigned } from "../utils/genPresigned";



export class userController {

    private _userservice: userService

    constructor() {
        this._userservice = new userService()
    }



    public registerUser = async (req: Request, res: Response) => {

        try {

            const { name, email, password } = req.body
            console.log(`name:${name} , email:${email} , Password:${password}`)
            const userData: IUser = {
                name: name,
                email: email,
                password: password
            }
            const result = await this._userservice.registerUser(userData)

            if (result?.success) {
                res.status(StatusCode.OK).json({ success: true, message: result.message, data: result.data })
            } else {

                res.status(StatusCode.BadRequest).json({ success: false, message: result?.message })
            }
        } catch (error) {
            console.error("Error registering the user:", error);
            res.status(StatusCode.InternalServerError).json({ success: false, message: "Internal Server Error" });
        }
    }


    public loginUser = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body
            console.log(`email : ${email} , password: ${password}`)
            const userdata: IUserdata = {
                email: email,
                password: password
            }

            const result = await this._userservice.loginuser(userdata)

            if (!result?.success) {
                res.status(400).json({ message: result?.message })
            }
            else {

                const token = generateToken({ userId: result.data?.userId, name: result.data?.name, email: result.data?.email })
                res.status(StatusCode.OK).json({ success: result.success, message: result.message, token })
            }
        } catch (error) {
            console.error("Error in loginUser:", error);
            res.status(StatusCode.InternalServerError).json({ message: "An error occurred" });
        }
    }


    public getUserProfile = async (req: Request, res: Response) => {
        try {
            const user = req.user as { _id: string; name: string; email: string };
            const userId = user._id;

            const userprofile = await this._userservice.getUser(userId)
            console.log("userprofile @ controller", userprofile)
            res.status(StatusCode.OK).json({ message: userprofile.message, userdata: userprofile.user });
        } catch (error) {
            console.error("Error fetching user:", error);
            res.status(StatusCode.InternalServerError).json({ message: "Internal Server Error" });
        }
    };

    public updateName = async (req: Request, res: Response) => {
        try {
            const user = req.user as { _id: string; name: string; email: string };
            const userId = user._id;

            const newName = req.body.name;
            const updatedName = await this._userservice.updateName(userId, newName);

            if (!updatedName) {
                res.status(StatusCode.NotFound).json({ message: "User not found or name update failed" });
                return
            }

            res.status(StatusCode.OK).json({ message: "Name updated successfully", name: updatedName });
            return
        } catch (error) {
            console.error("Error updating name:", error);
            res.status(StatusCode.InternalServerError).json({ message: "Internal Server Error" });
        }
    }

    public updateImage = async (req: Request, res: Response) => {
        try {
            const user = req.user as { _id: string; name: string; email: string };
            const userId = user._id;
            const newImage = req.body.s3url;


            const updatedImage = await this._userservice.updatenewImage(userId, newImage);

            if (!updatedImage) {
                res.status(StatusCode.NotFound).json({ message: "User not found or name update failed" });
                return
            }

            res.status(StatusCode.OK).json({ message: "Image updated successfully", profilepic: updatedImage });
            return
        } catch (error) {
            console.error("Error updating image:", error);
            res.status(StatusCode.InternalServerError).json({ message: "Internal Server Error" });
        }
    }



    public getAlltasks = async (req: Request, res: Response) => {
        try {

            const user = req.user as { _id: string; name: string; email: string };
            const userid = user._id
            const alltasks = await this._userservice.getUsertasks(userid)
            res.status(StatusCode.OK).json({ alltasks })
        } catch (error) {
            console.error("Error @ getAlltasks:", error);
            res.status(StatusCode.InternalServerError).json({ message: "Internal Server Error" });
        }
    }


    public addTask = async (req: Request, res: Response) => {
        try {
            const user = req.user as { _id: string; name: string; email: string };
            const userid = user._id
            const { title, description } = req.body.taskdata

            if (!title) {
                res.status(StatusCode.BadRequest).json({ error: "Title is required" });
            }

            const taskdata: Itaskdata = {
                title: title,
                description: description,
                creatorId: userid
            }
            console.log("tasks", title)
            const result = await this._userservice.addtask(taskdata)
            res.status(StatusCode.OK).json({ message: result?.message, task: result.task })
        } catch (error) {
            console.error("Error @ addTask:", error);
            res.status(StatusCode.InternalServerError).json({ message: "Internal Server Error" });
        }
    }


    public updatestatus = async (req: Request, res: Response) => {
        try {
            const user = req.user as { _id: string; name: string; email: string };
            const userId = user._id;
            const status = req.body.status;
            const taskId = req.params.taskid.startsWith(':')
                ? req.params.taskid.slice(1)
                : req.params.taskid;

            console.log("Status:", status);
            console.log("Task ID:", taskId);

            const updatedTask = await this._userservice.updateTaskStatus(taskId, userId, status);

            if (!updatedTask) {
                res.status(StatusCode.NotFound).json({ message: "Task not found or unauthorized" });
                return
            }

            res.status(StatusCode.OK).json({ message: "Task status updated successfully", task: updatedTask });
            return
        } catch (error) {
            console.error("Error updating task status:", error);
            res.status(StatusCode.InternalServerError).json({ message: "Internal Server Error" });
        }
    }



    public deleteTask = async (req: Request, res: Response) => {
        try {
            const taskId = req.params.taskId;
            const user = req.user as { _id: string; name: string; email: string };
            const userId = user._id;

            const deletedTask = await this._userservice.deleteTask(taskId, userId);

            if (!deletedTask) {
                res.status(StatusCode.NotFound).json({ message: 'Task not found or unauthorized' });
            }

            res.status(StatusCode.OK).json({ message: 'Task deleted successfully' });
        } catch (error) {
            console.error('Error deleting task:', error);
            res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
        }
    };


    public updateTask = async (req: Request, res: Response) => {
        try {
            const taskId = req.params.id;
            const updatedData = req.body;

            const updatedTask = await this._userservice.updateTask(taskId, updatedData);

            if (!updatedTask) {
                res.status(StatusCode.NotFound).json({ message: "Task not found" });
            }

            res.status(StatusCode.OK).json({ message: "Task updated successfully", task: updatedTask });
        } catch (error) {
            console.error("Error updating task:", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    };





    public genPresignedURL = async (req: Request, res: Response) => {
        const { fileName, fileType } = req.body
        try {
            const presignedURL = await generatepresigned(fileName, fileType)
            res.json({ presignedURL })
        } catch (error) {
            console.error("Error in presignedurl:", error);
            res.status(StatusCode.InternalServerError).json({ message: "An error occurred" });
        }
    }
}