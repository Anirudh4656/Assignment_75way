import express from "express";
import { blockUser, closeDiscussion, deleteUser, getAllUsers } from "../controller/adminController";
const router=express.Router();

router.put('/blockUser/:id',blockUser);
router.get('/getAllUsers',getAllUsers);
router.patch('/closeDiscussion/:id',closeDiscussion);
router.put('/deleteUser/:id',deleteUser);
export default router;