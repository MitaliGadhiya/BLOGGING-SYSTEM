import { Schema,model } from "mongoose";
import { commentInterface } from "../interface";
import { timeStamp } from "console";


const commentSchema = new Schema<commentInterface>({
    content:{
        type: String,
        required: true
    },
    userID:{
        type: Schema.Types.ObjectId,
        ref: 'userInterface',
        required: true
    },
    blogpostID:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'blogpostInterface'
    },
    likes:{
        type: Number,
        required: true
    },
    dislike:{
        type: Number,
        required: true
    }

},{timestamps:true})

export const commentModel = model<commentInterface>('comment',commentSchema)


