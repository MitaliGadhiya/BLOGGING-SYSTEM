import { Schema,model } from "mongoose";
import { userInterface } from "../interface";


const userSchema = new Schema<userInterface>({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        unique: true,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    profile_info:{
        type: String,
        required: true
    }

},{timestamps:true})

export const userModel = model<userInterface>('users',userSchema)


