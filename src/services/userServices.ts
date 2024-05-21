import { userInterface } from "../interface";
import { userModel } from "../models";
import jwt  from "jsonwebtoken";
import { injectable } from "inversify";
import dotenv from 'dotenv'

dotenv.config()
const secretkey = process.env.SECRETKEY || ''

@injectable()
export class userServices{

    async userData(body : userInterface):Promise<void>{
        const {name,email,password,profile_info} = body;
        const newUser = new userModel({name,email,password,profile_info})
        await newUser.save();
    }

    async login(email : string, password: string):Promise<String>{
        const user = userModel.findOne({email,password})
        if (user) {
            const role = (await user).profile_info
            const token = jwt.sign({ email, role }, secretkey, { expiresIn: '1h' })
        return token
          } else {
            return null
          }
    }
}