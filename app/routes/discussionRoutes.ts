import express from "express";
import { Request, Response } from 'express';
const router=express.Router();
import expressAsyncHandler from "express-async-handler";
import { createDiscussion, getDiscusssion, getUserDiscusssion, likeDiscussion, replyToDiscussion } from "../controller/discussionController";

router.post("/createDiscussion",createDiscussion);
router.post("/likeDiscussion",likeDiscussion);
router.post("/replyDiscussion/:id",replyToDiscussion);
router.get("/getDiscussion",getDiscusssion);
//why /:id?
router.get("/getUserDiscussion",getUserDiscusssion);


export default router;
