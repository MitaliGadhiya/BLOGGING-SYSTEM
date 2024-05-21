import { blogpostServices } from "../services";
import { NextFunction, Request,Response } from "express";
import { controller,httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../utils/types";
import errorMessage from "../utils/errorHandling";
import { blogpostInterface } from "../interface";

@controller('/blogpost')
export class blogpostController{
    private  blogpostService : blogpostServices;
    constructor(@inject (TYPES.blogpostServices) blogpostServices : blogpostServices){
        this.blogpostService = blogpostServices
    }

    @httpPost('/InsertData')
    async userData(req: Request, res: Response,next: NextFunction):Promise<void>{
        try{
            const {title,content, userID, likes, dislikes} = req.body;
            const body : blogpostInterface = {title,content, userID, likes, dislikes}
            await this.blogpostService.blogData(body)
            res.send("BLOG SUCCESSFULLY REGISTERED")
        }
        catch(err){
            errorMessage(err,req,res,next)
        }
    }
}