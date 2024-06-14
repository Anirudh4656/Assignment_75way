import express from "express";
const router=express.Router();
import {registerUser,loginUser} from "../controller/user";
// import { catchError, validate } from "../middleware/validation";
router.route('/login').post(loginUser);
router.route('/Signup').post(registerUser);

export default router;
