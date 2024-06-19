import express from "express";
const router=express.Router();
import { User,type IUser } from '../schemas/User';
// import {registerUser,loginUser} from "../controller/user";
import passport from "passport";
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import {  pick } from 'lodash';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { validate } from "../middlewares/validations";
import expressAsyncHandler from "express-async-handler";
import { createUserTokens } from "../services/passport-jwt";
import { createResponse } from "../helper/response";
import { loginUser, registerUser,updateUser } from "../controller/user";

// import { catchError, validate } from "../middleware/validation";
// router.route('/login').post(loginUser);
// router.route('/Signup').post(registerUser);
// router.post('/signup',(req,res,next)=>{
//     passport.authenticate('signup', { session: false }, (err:any, user: IUser, info:any) => {
//         if (err || !user) {
//           return res.status(400).json({ message: info.message || 'Signup failed', user });
//         }
    
//         res.status(200).json({ message: 'Signup successful', user });
//       })(req, res, next)}
// )
router.post(
  "/signin",
  passport.authenticate("login", { session: false }),
  validate("users:login"),loginUser);


router.post('/signup',registerUser );

router.put(
  "/:id",
  passport.authenticate('jwt',{session:false}),updateUser)

      
        // const decodedAccessToken: any = jwtDecode(accessToken);
        // const accessTokenExpiry = decodedAccessToken.exp; // Extract expiry from decoded token
        // res.json({
        //   refreshToken,
        //   accessToken,
        //   accessTokenExpiry,
        //   user: req.user1,
        // });
      
       
  


export default router;
