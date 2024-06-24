import { Request, Response } from 'express';
import { User, UserRole } from '../schemas/User';
import { Discuss } from '../schemas/User';
import expressAsyncHandler from 'express-async-handler';
import createHttpError from "http-errors";
import { createResponse } from '../helper/response';
//self type
export const blockUser = expressAsyncHandler(async(req: Request, res: Response) => {
  //other method for id
  console.log("i am in blockUser");
  const {id}=req.params
  console.log(id);
  const user = await User.findById(id);
  console.log(user);
  if (!user) {
    //throw http error
    //i am not able to use return here?
    throw createHttpError(404, {
      message: `Invalid User not found`,
    });
    
  }
  user.isBlocked = true;
  user.role=UserRole.USER;
  await user.save();
  console.log(user);
  res.send(createResponse({msg: 'User blocked' }));
});
export const getAllUsers = expressAsyncHandler(async (req: Request, res: Response) => {
  const users = await User.find();
  console.log(users);
  res.json(users);
});


export const closeDiscussion = expressAsyncHandler(async(req: Request, res: Response):Promise<void> => {
  const {id}=req.params
  const dis = await Discuss.find();
  console.log(dis);
  const discussion = await Discuss.findById(id);
  if (!discussion) {
    throw createHttpError(404, {
      message: `Discussion not found`,
    });
     
  }
  discussion.isClosed = true;
  await discussion.save();
  //go through createresponse
  res.send(createResponse({msg: 'Discussion closed' }));
  // res.json({ msg: 'Discussion closed' });
});
// router.get(
//   "/all",
//   passport.authenticate("jwt", {session: false}),
//   catchError,
//   expressAsyncHandler(async(req, res)=> {
//     const users = await User.find();
//     res.json(users);
//     //res.send(createResponse(users, "All users retrieved"));
//   })
// );
