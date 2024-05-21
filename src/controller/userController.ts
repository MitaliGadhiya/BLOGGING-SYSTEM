
import { userServices } from "../services";
import { NextFunction, Request,Response } from "express";
import { controller,httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../utils/types";
import errorMessage from "../utils/errorHandling";
import { userInterface } from "../interface";
import { STATUS_CODE, SUCCESS_MESSAGE,NOT_FOUND } from "../utils/constant";

@controller('/user')
export class userController{
    private  userService : userServices;
    constructor(@inject (TYPES.userServices) userServices : userServices){
        this.userService = userServices
    }

    @httpPost('/InsertData')
    async userData(req: Request, res: Response,next: NextFunction):Promise<void>{
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

    @httpPost('/find')
    async login(req: Request, res: Response, next:NextFunction): Promise<void> {
      try {
        const { email, password } = req.body
        const token = await this.userService.login(email, password)
        if (token) {
          res.cookie('token', token, { secure: false, httpOnly: true })
          res.status(STATUS_CODE.OK).send(SUCCESS_MESSAGE)
        } else {
          res.status(STATUS_CODE.NOT_FOUND).send(NOT_FOUND)
        }
      } catch (err) {
        errorMessage(err,req,res,next)
      }
    }
}