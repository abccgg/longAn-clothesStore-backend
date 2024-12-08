import express from 'express'
import { loginUser,registerUser,adminLogin, detailsUser, updateUser } from '../controllers/userController.js'

const userRouter = express.Router();
userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.post('/admin',adminLogin)
userRouter.get('/details/:id',detailsUser)
userRouter.put('/update/:id',updateUser)

export default userRouter;