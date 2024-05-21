import { Schema,model } from "mongoose";
import { blogpostInterface } from "../interface";


const blogpostSchema = new Schema<blogpostInterface>({
    title:{
        type: String,
        required: true
    },
    content:{
        type: String,
        required: true
    },
    userID:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'userInterface'
    },
    likes:{
        type: Number,
        required: true
    },
    dislikes:{
        type: Number,
        required: true
    }

},{timestamps:true})

export const  blogpostModel = model<blogpostInterface>('blogpost',blogpostSchema)


