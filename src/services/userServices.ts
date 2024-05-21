import { userInterface } from "../interface";
import { userModel } from "../models";

import { injectable } from "inversify";

@injectable()
export class userServices{

    async userData(body : userInterface):Promise<void>{
        const {name,email,password,profile_info} = body;
        const newUser = new userModel({name,email,password,profile_info})
        await newUser.save();
    }
}