import { Router } from "express";
import { userController } from "../controller/usercontroller";
import passport from "passport";



const router = Router()

const _usercontroller = new userController()

//user specific routes
router.post('/register' , _usercontroller.registerUser)
router.post('/login' , _usercontroller.loginUser)
router.get('/userprofile', passport.authenticate('jwt' , {session:false}), _usercontroller.getUserProfile)
router.post('/generatepresigned', _usercontroller.genPresignedURL)
router.patch('/update-name', passport.authenticate('jwt' , {session:false}) , _usercontroller.updateName)
router.patch('/update-image', passport.authenticate('jwt' , {session:false}) , _usercontroller.updateImage)

//task specific routes
router.get('/tasks' , passport.authenticate('jwt' , {session:false}) , _usercontroller.getAlltasks)
router.post('/addtask' , passport.authenticate('jwt' , {session:false}) , _usercontroller.addTask )
router.patch('/updatestatus/:taskid', passport.authenticate('jwt' , {session:false}) , _usercontroller.updatestatus)
router.delete('/deletetask/:taskId',passport.authenticate('jwt' , {session:false}) , _usercontroller.deleteTask);
router.put('/updatedata/:id',passport.authenticate('jwt' , {session:false}) , _usercontroller.updateTask);

export default router