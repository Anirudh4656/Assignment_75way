import express from "express";
import { Request, Response } from 'express';
const router=express.Router();
import expressAsyncHandler from "express-async-handler";
import { replyLike ,createDiscussion, getDiscusssion, getUserDiscusssion, likeDiscussion, nestedReply, replyToDiscussion } from "../controller/discussionController";

router.post("/createDiscussion",createDiscussion);
router.patch("/likeDiscussion/:id",likeDiscussion);
router.patch("/replyDiscussion/:id",replyToDiscussion);
router.get("/getDiscussion",getDiscusssion);
//why /:id?
router.get("/getUserDiscussion/:id",getUserDiscusssion);
router.patch("/nestedReply",nestedReply);
router.patch("/likeReply/:id",replyLike );


export default router;
