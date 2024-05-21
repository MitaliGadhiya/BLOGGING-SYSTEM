
import { userServices } from "../services";
import { NextFunction, Request,Response } from "express";
import { controller,httpPost, httpPut } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../utils/types";
import errorMessage from "../utils/errorHandling";
import { userInterface } from "../interface";

@controller('/user')
export class userController{
    private  userService : userServices;
    constructor(@inject (TYPES.userServices) userServices : userServices){
        this.userService = userServices
    }

    @httpPost('/InsertData')
    async userData(req: Request, res: Response,next: NextFunction):Promise<void>{
        console.log(req.params.id);
        try{
            const {name,email,password,profile_info} = req.body;
            const body : userInterface = {name,email,password,profile_info}
            await this.userService.userData(body)
            res.send("USER SUCCESSFULLY REGISTERED")
        }
        catch(err){
            errorMessage(err,req,res,next)
        }
    }
}