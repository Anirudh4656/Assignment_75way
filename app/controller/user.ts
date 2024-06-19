import { type IUser ,User} from "../schemas/User";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";
import { createUserTokens } from "../services/passport-jwt";

//validate

export const loginUser= expressAsyncHandler(async (req:any, res, next) => {
        const {refreshToken, accessToken} = createUserTokens(req.user!);
        const user1 = await User.findOneAndUpdate({ email: req.body.email}, {refreshToken}, {
          new: true,
        });
        res.send(
          createResponse({ ...createUserTokens(req.user!), user: req.user })
        );
});
export const registerUser=expressAsyncHandler(async(req:any, res:any) => {
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
   
  });
  export const updateUser=expressAsyncHandler(async(req,res)=>{
    const user=req.params.id;
    const result= await User.findByIdAndUpdate(user,req.body);
     res.send(createResponse(user,"User updated successfully"))
  })