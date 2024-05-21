import { Schema } from "mongoose";

export interface blogpostInterface{
    title: string;
    content: string;
    userID: Schema.Types.ObjectId;
    likes: number;
    dislikes: number;
}