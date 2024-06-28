import {Discuss, IUser, Like, Reply} from "../schemas/User";
import {  NextFunction, Request, Response } from 'express';
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";
import { ObjectId } from 'mongodb';
import mongoose from "mongoose";


export  const createDiscussion=expressAsyncHandler(async(req:Request,res:Response)=>{
 const {title,content}=req.body;
  const result = req.user as IUser;
  console.log("in req user",result);

//667dc51b36a5ed8dcc799819
//why user but we need only user.id?
 const discuss= new Discuss({title,content,user:result.id})
  await discuss.save();
console.log("in cretae discuss",discuss);
 res.send(createResponse(discuss));

 })
export const likeDiscussion =expressAsyncHandler(async(req: Request, res: Response) => {
  const user = req.user as IUser;
  //name ?
  const { id } =req.params;
  console.log(" ",id);
  const discussion = await Discuss.findById(id)
  console.log("in. ",discussion);
  let like
  if (discussion) {
    const userLike = discussion.likes.find((like: any) => like.user === user._id);
   
    if (userLike) {
      // Unlike
      discussion.likes = discussion.likes.filter((like: any) => like.user !== user._id);
      await Like.findByIdAndDelete(userLike);
    } else {
      console.log("inuserlike");
       like = new Like({ user: user._id, Discuss: req.params.DiscussId });
      await like.save();
      discussion.likes.push(like.id);
    }
    await discussion.save();
  }


  res.send(createResponse(like));
});

export const getDiscusssion = expressAsyncHandler(async (req: Request, res: Response) => {
  const Discusss = await Discuss.find().populate('replies');

  //error in .populate
  console.log("in dicuss",Discusss);
  res.send(createResponse(Discusss));

});
//to check
export const getUserDiscusssion = expressAsyncHandler(async (req: Request, res: Response) => {
  const {id}=req.params;
  const Discusss = await Discuss.findById(id)
  console.log("dd",Discuss);
  res.send(createResponse(Discusss));
  // console.log(`i am user${user}`);
  // const UserString=JSON.stringify({user});
  // console.log(UserString);
  
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).json({ msg: 'Invalid user ID' });
  // }
  //id is getting from req.user
  //declare private

  // res.send(createResponse(Discusss));
});

//
  export const replyToDiscussion = expressAsyncHandler(async (req: Request, res: Response,next:NextFunction) => {
    const { content } = req.body;
    const { id }=req.params;
    console.log(id);
    const user = req.user as IUser;
    // const userId=user._doc._id;
  //when iam  sending user._id not working but sending user it is working
  console.log("in id",id);
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(createHttpError(400, 'Invalid discussion ID format'));
  }
  const userId = new ObjectId(id);
  console.log("in userid",user.username,);
   
  try{
    
    const discussion = await Discuss.findById(id);
   
if(discussion){
  const  reply = new Reply({ content, user: user.id, discussion:userId });  
  await reply.save();
console.log("newreply:",reply);

  
 
//   const payload = {

//     id:reply._id ,
//     user:reply.user,
//     content:reply.content
// }
// console.log("payload:",payload);
  if (discussion) {
    discussion.replies.push(reply);
    await discussion.save();
  }
  console.log("in reply after discussion",discussion)
  res.send(createResponse(reply));
}
   
  }catch(e){
    console.log(e);
  }
   

 
  });
  

function createHttpError(arg0: number, arg1: string) {
  throw new Error("Function not implemented.");
}
  