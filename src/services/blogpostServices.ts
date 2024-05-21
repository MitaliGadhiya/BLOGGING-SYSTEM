import { blogpostInterface } from "../interface";
import { blogpostModel } from "../models";
import { injectable } from "inversify";

@injectable()
export class blogpostServices{

    async blogData(body : blogpostInterface):Promise<void>{
        const {title,content, userID, likes, dislikes} = body;
        const newUser = new blogpostModel({title,content, userID, likes, dislikes})
        await newUser.save();
    }
}