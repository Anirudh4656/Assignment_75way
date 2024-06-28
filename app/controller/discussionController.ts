import {Discuss, IUser, Like, Reply} from "../schemas/User";
import { Request, Response } from 'express';
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";

export  const createDiscussion=expressAsyncHandler(async(req:Request,res:Response)=>{
 const {title,content}=req.body;
  const {_doc} = req.user as IUser;
  console.log("in req user",_doc._id);
  //66727439a71b6be5966a5507
  
//why user but we need only user.id?
 const discuss= new Discuss({title,content,user:_doc._id})
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
  const Discusss = await Discuss.find()
  //error in .populate
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
  export const replyToDiscussion = expressAsyncHandler(async (req: Request, res: Response) => {
    const { content } = req.body;
    const {id}=req.params;
    console.log(id);
    const user = req.user as IUser;
    // const userId=user._doc._id;
  //when iam  sending user._id not working but sending user it is working

    let reply
  try{
     reply = new Reply({ content, user: user, discussion: id});
    await reply.save();
  
    const discussion = await Discuss.findById(id);
    console.log("in reply discussion",discussion)
    const payload = {

      id:reply._id ,
      user:reply.user,
      content:reply.content
  }
    if (discussion) {
      // discussion.replies.push(payload);
      // await discussion.save();
    }
    console.log("in reply after discussion",discussion)
  }catch(e){
    console.log(e);
  }
   

    res.send(createResponse(reply));
  });
  
  