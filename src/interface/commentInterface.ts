import mongoose from "mongoose";

export interface commentInterface{
    content: string;
    userID: mongoose.Types.ObjectId;
    blogpostID: mongoose.Types.ObjectId;
    likes: number;
    dislike: number;
}       