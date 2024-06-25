import { type IUser ,User} from "../schemas/User";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";
import { createUserTokens } from "../services/passport-jwt";

//validate

export const loginUser= expressAsyncHandler(async (req:any, res, next) => {
        // const {refreshToken, accessToken} = createUserTokens(req.user!);
        // const user1 = await User.findOneAndUpdate({ email: req.body.email}, {refreshToken}, {
        //   new: true,
        // });
        //req.user??
        console.log("in user token",req.user._doc)

        const createToken=createUserTokens(req.user._doc!)
        console.log("in createToken",createToken);
        res.send(
          createResponse({ ...createToken, user: req.user._doc })
        );
});
export const registerUser=expressAsyncHandler(async(req:any, res:any) => {
    const { username,email, password } = req.body as IUser;
    const duplicateUser = await User.findOne({ email });
  //validateUser from github 
// "data": {
//     "user": {
//       "username": "anirudhdf1gsdfdfhgfgfgffgfsddfgfgfgfgfhghyghgh11fsharma",
//       "password": "$2b
// {
//   "data": {
//     "username": "anirudhdf1gsdfdfhddddsgfgfgffgfsddfgfgfgfgfhghyghgh11fsharma",
//     "password": "$2b$12$aN.BT.VGHs5c/8g5GvvmuOTbuFt3W3rvnFxYQc5wIVlwtnCx42Lla",
//     "email": "anirudh.70ffdfgddddfgffdf51dddg1way@gmail.com",
//     "role": "USER",
//     "isBlocked": false,
//     "_id": "66740f4adc0f800d42a47e0c",
//     "__v": 0
//   },
//   "success": true
//check
//can use in Passportjs
    if (duplicateUser) {
      return res.status(400).json({ msg: 'Invalid credentials or user blocked' });
    }//will change to through http error
    const user = new User({ email, password,username });
    await user.save();
    console.log("success")
  res.send(createResponse( user));
    // res.send(createResponse({ ...createUserTokens(req.user!), user}));
    // const token=jwt.sign(user,"asdfghjryetebh");
    // res.header('x-auth-token',token)
    // .header('access-control-expose-headers',"x-auth-token")
    // .send(_.pick(user,["_id","name","email"]));
    // working fine check validatefunction
   
  });
  export const updateUser=expressAsyncHandler(async(req,res)=>{
    const {id}=req.params;
    const result= await User.findByIdAndUpdate(id,req.body);
     res.send(createResponse(result,"User updated successfully"))
  });

  //tobedone
  // user using (register-with-link)
  //set-new-pasword/:token
  //updateUser
  //replyToDiscussion
  //getUserDiscussion
  //nestedreply