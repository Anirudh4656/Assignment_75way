import {Discuss, IUser, Like, Reply} from "../schemas/User";
import { Request, Response } from 'express';
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";

export  const createDiscussion=expressAsyncHandler(async(req:Request,res:Response)=>{
 const {title,content}=req.body;


  const user = req.user as IUser;
  console.log(user);
  //66727439a71b6be5966a5507
  
//why user but we need only user.id?
 const discuss= new Discuss({title,content,user:user})
 await discuss.save();
 console.log(discuss);
 res.send(createResponse(discuss));
//  res.json(discuss);
})
export const likeDiscussion =expressAsyncHandler(async(req: Request, res: Response) => {
  const user = req.user as IUser;
  const like = new Like({ user: user._id, Discuss: req.params.DiscussId });
  await like.save();
  res.send(createResponse(like));
});

export const getDiscusssion = expressAsyncHandler(async (req: Request, res: Response) => {
  const Discusss = await Discuss.find().populate('user', 'username');
  res.json(Discusss);
});
//to check
export const getUserDiscusssion = expressAsyncHandler(async (req: Request, res: Response) => {
  const user = req.user as IUser ;
  console.log("in get diss")
  console.log(user);
  // console.log(`i am user${user}`);
  // const UserString=JSON.stringify({user});
  // console.log(UserString);
  
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).json({ msg: 'Invalid user ID' });
  // }
  //id is getting from req.user
  //declare private
 const discussions = await Discuss.findById(user._doc._id);
  console.log(discussions)
  // res.send(createResponse(Discusss));
});

//


  export const replyToDiscussion = expressAsyncHandler(async (req: Request, res: Response) => {
    const { content } = req.body;
    const {id}=req.params;
    console.log(id);
    const user = req.user as IUser;
    // const userId=user._doc._id;
  //when iam  sending user._id not working but sending user it is working
    console.log(JSON.stringify(user, null, 2));
  
    const reply = new Reply({ content, user: user, discussion: id});
    await reply.save();
    res.json(reply);
  });
  
  