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
router.post('/signup', expressAsyncHandler(async(req:any, res:any) => {
    const { username,email, password } = req.body as IUser;
    const duplicateUser = await User.findOne({ email });
  //validateUser from github 

//check
    // if (duplicateUser || duplicateUser?.isBlocked ) {
    //   return res.status(400).json({ msg: 'Invalid credentials or user blocked' });
    // }
    const user = new User({ email, password,username });
    await user.save();
    console.log("done");
    res.send(createResponse(user, "User created successfully!"));
    // const token=jwt.sign(user,"asdfghjryetebh");
    // res.header('x-auth-token',token)
    // .header('access-control-expose-headers',"x-auth-token")
    // .send(_.pick(user,["_id","name","email"]));
    // working fine check validatefunction
   
  }))

// router.post('/signin', (req: Request, res: Response, next: Function) => {

//     passport.authenticate('login', { session: false }, expressAsyncHandler(async(req:any,res:any) => {
    
//     console.log("okkkk");

//     }))
    router.post(
      "/login",
      passport.authenticate("login", { session: false }),
      validate("users:login"),
      expressAsyncHandler(async (req:any, res, next) => {
        const {refreshToken, accessToken} = createUserTokens(req.user!);
        const user1 = await User.findOneAndUpdate({ email: req.body.email}, {refreshToken}, {
          new: true,
        });
        res.send(
          createResponse({ ...createUserTokens(req.user!), user: req.user })
        );
        // const decodedAccessToken: any = jwtDecode(accessToken);
        // const accessTokenExpiry = decodedAccessToken.exp; // Extract expiry from decoded token
        // res.json({
        //   refreshToken,
        //   accessToken,
        //   accessTokenExpiry,
        //   user: req.user1,
        // });
      
       
  
  }))

export default router;
