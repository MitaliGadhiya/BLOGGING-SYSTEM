import { commentModel } from "../models";
import { injectable } from "inversify";
import { commentInterface} from "../interface";


@injectable()
export class commentServices{

    async commentData(body : commentInterface):Promise<void>{
        const {content, userID, blogpostID, likes, dislike}  = body
        const newUser = new commentModel({content, userID, blogpostID, likes, dislike})
        await newUser.save();
    }
}