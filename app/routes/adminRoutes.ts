import express from "express";
import { blockUser, closeDiscussion, getAllUsers } from "../controller/adminController";
const router=express.Router();

router.put('/blockUser/:id',blockUser);
router.get('/getAllUsers',getAllUsers);
router.post('/closeDiscussion/:id',closeDiscussion);
export default router;