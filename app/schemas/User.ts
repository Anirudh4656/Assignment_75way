import mongoose from "mongoose";
import { type BaseSchema } from "./index";


export enum UserRole {
   
    USER = "USER",
    ADMIN = "ADMIN",
  }

  const Schema=mongoose.Schema;
  export interface IUser extends BaseSchema {
    email:string;
    active:boolean;
    password:string;
    role:UserRole;
  }

  const UserSchema=new Schema<IUser>(
    {
        email:{type:String,required:true,unique:true},
    }
  )
//   UserSchema.pre("save",async function(next)){

//   }
export default mongoose.model<IUser>('user',UserSchema);
