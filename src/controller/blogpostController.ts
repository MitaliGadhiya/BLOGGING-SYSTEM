import { blogpostServices } from "../services";
import { NextFunction, Request,Response } from "express";
import { controller,httpPost } from "inversify-express-utils";
import { inject } from "inversify";
import { TYPES } from "../utils/types";
import errorMessage from "../utils/errorHandling";
import { blogpostInterface } from "../interface";
import { Auth } from "../middleware/auth";

@controller('/blogpost')
export class blogpostController{
    private  blogpostService : blogpostServices;
    constructor(@inject (TYPES.blogpostServices) blogpostServices : blogpostServices){
        this.blogpostService = blogpostServices
    }

    @httpPost('/InsertData',Auth)
    async userData(req: Request, res: Response,next: NextFunction):Promise<void>{
        try{
            const abc: any = req.find
            console.log(abc);
            if(abc.role === 'admin'){
                const {title,content, userID, likes, dislikes} = req.body;
                const body : blogpostInterface = {title,content, userID, likes, dislikes}
                await this.blogpostService.blogData(body)
                res.send("BLOG SUCCESSFULLY REGISTERED")
            }
            else{
                res.send("ONLY ADMIN AND AUHTOR ARE INSERT BLOG")
            }
        }
        catch(err){
            errorMessage(err,req,res,next)
        }
    }
}