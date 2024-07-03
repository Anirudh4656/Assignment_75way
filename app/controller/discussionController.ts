import { Discuss, IUser, Like, Reply } from "../schemas/User";
import { NextFunction, Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { createResponse } from "../helper/response";
import { ObjectId } from "mongodb";
import mongoose from "mongoose";
import { selectClasses } from "@mui/material";

export const createDiscussion = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { title, content } = req.body;
    const result = req.user as IUser;
    console.log("in req user", result);

    //667dc51b36a5ed8dcc799819
    //why user but we need only user.id?
    const discuss = new Discuss({ title, content, user: result.id });
    await discuss.save();
    console.log("in cretae discuss", discuss);
    res.send(createResponse(discuss));
  }
);
export const likeDiscussion = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as IUser;
    //name ?
    console.log("in user.id", user.id);
    const { id } = req.params;
    const userId = new ObjectId(id);
    console.log(" ", id);
    try {
      const discussion = await Discuss.findById(id).populate({
        path: "likes",
      });

      console.log("in. ", discussion);
      // if (!discussion) {
      //   return res.status(404).json({ message: 'Discussion not found' });
      // }
      let like;
      if (discussion) {
        //6682786733a502194736ae63
        const userLike = discussion.likes.find((like: any) =>
          like.user.equals("6682786733a502194736ae63")
        );

        console.log("like found or not", userLike);

        if (userLike) {
          // Unlike
          console.log("inuser unlike");
          discussion.likes = discussion.likes.filter(
            (like: any) => !like.user.equals(user.id)
          );
          await Like.findByIdAndDelete(userLike);
          console.log("inuser unlike success");
        } else {
          console.log("inuserlike");
          like = new Like({ user: user.id, Discussion: id });
          await like.save();
          console.log("inn c l", like);
          discussion.likes.push(like);
          console.log("in after discussion. ", discussion);
        }

        await discussion.save();
        console.log("in backend of like", like);
        res.send(createResponse(like));
      }
    } catch (error) {
      console.log(error);
    }
  }
);

export const getDiscusssion = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const Discusss = await Discuss.find()
      .sort({ _id: -1 })
      .populate("replies")
      .populate("likes");

    //error in .populate
    console.log("in dicuss", Discusss);
    res.send(createResponse(Discusss));
  }
);
//to check
export const getUserDiscusssion = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const Discusss = await Discuss.findById(id);
    console.log("dd", Discuss);
    res.send(createResponse(Discusss));
  }
);

//
export const replyToDiscussion = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { content } = req.body;
    const { id } = req.params;
    console.log(id);
    const user = req.user as IUser;
    // const userId=user._doc._id;
    //when iam  sending user._id not working but sending user it is working
    console.log("in id", id);
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(createHttpError(400, "Invalid discussion ID format"));
    }
    const userId = new ObjectId(id);
    console.log("in userid", user.username);

    try {
      const discussion = await Discuss.findById(id);

      if (discussion) {
        const reply = new Reply({
          content,
          user: user.id,
          discussion: userId,
          username: user.username,
        });
        await reply.save();
        console.log("newreply:", reply);

        if (discussion) {
          discussion.replies.push(reply);
          await discussion.save();
        }
        console.log("in reply after discussion", discussion);
        res.send(createResponse(reply));
      }
    } catch (e) {
      console.log(e);
    }
  }
);
export const nestedReply = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user as IUser;
    console.log("in nested comments", user.user);
    const { discussionId, parentReplyId, content } = req.body;
    try {
      const discussion = await Discuss.findById(discussionId);
      if (discussion) {
        const nestedReply = new Reply({
          content,
          user: user.id,
          discussion: discussionId,
          username: user.user,
        });
        console.log("in nested reply", nestedReply);
        await nestedReply.save();
        // const parentreply=discussion?.replies.find((reply:any)=>reply.id ===parentReplyId);
        const parentReply = await Reply.findById(parentReplyId);
        if (parentReply) {
          console.log("Parent reply is:", parentReply);
          parentReply.replies.push(nestedReply);
          await parentReply.save();
        }
        console.log("Parent reply after is:", parentReply);
        res.send(createResponse(parentReply));
      }
    
    } catch (e) {
      console.log(e);
    }
  }
);

export const LikeComment = async (req: Request, res: Response) => {
  const user = req.user as IUser;
  const { id } = req.params;

  // const replyId = "6683a271b5785ce930501a1c";
  try {
    const reply = await Reply.findById(id);
    console.log("reply",reply);

    const existingLike = await Like.findOne({ user: user.id, reply: id});
    console.log("existingLike",existingLike);
    if (existingLike && reply) {
      await Like.findByIdAndDelete(existingLike._id);
      reply.likes = reply.likes.filter(
        (like) => !like.equals(existingLike._id)
      );
    } else {
      const newLike = new Like({ user: user.id, reply: id });
      await newLike.save();
      console.log("new like", newLike);
      reply?.likes.push(newLike);
     
      await reply?.save();
    }
    console.log("in reply after pushing data",reply)
    res.send(createResponse(reply));
  } catch (e) {
    console.log(e);
  }
};
function createHttpError(arg0: number, arg1: string) {
  throw new Error("Function not implemented.");
}
