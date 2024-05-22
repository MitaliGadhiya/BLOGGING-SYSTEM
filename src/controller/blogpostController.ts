import { blogpostServices } from '../services'
import { NextFunction, Request, Response } from 'express'
import { controller, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../utils/types'
import errorMessage from '../utils/errorHandling'
import { blogpostInterface } from '../interface'
import { Auth } from '../middleware/auth'
import { blogpostModel } from '../models'

@controller('/blogpost')
export class blogpostController {
  private blogpostService: blogpostServices
  constructor(
    @inject(TYPES.blogpostServices) blogpostServices: blogpostServices
  ) {
    this.blogpostService = blogpostServices
  }

  @httpPost('/InsertData', Auth)
  async userData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {    
    try {
      const blog: any = req.find
      const { title, content, userID, likes, dislikes } = req.body
      if (blog._id === userID && (blog.role === 'admin' || blog.role === "author")) {
        const body: blogpostInterface = {
          title,
          content,
          userID,
          likes,
          dislikes
        }
        await this.blogpostService.blogData(body)
        res.send('BLOG SUCCESSFULLY REGISTERED')
      } else {
        res.send('ONLY ADMIN AND AUHTOR ARE INSERT BLOG')
      }
    } catch (err) {
      errorMessage(err, req, res, next)
    }
  }

  @httpPost("/UpdateBlog",Auth)
  async updateBlog(req:Request, res:Response, next:NextFunction){
    try{
        const update:any = req.find
        const {_id, userID,updateBlog} =req.body
        if(update._id === userID && (update.role === "admin" || update.role === "author")){
            const result = await blogpostModel.findOne({_id: update._id , userID : userID })
            if(result){
                await this.blogpostService.updateBlog(_id,updateBlog)
                res.send("BLOG SUCCESSFULLY UPDATED")
            }else{
                res.send("You cannot update other's post")
            }
        }
        else{
            res.send("ONLY ADMIN AND AUTHOR ARE UPDATED BLOG")
        }
    }catch(err){
        errorMessage(err,req,res,next)
    }    
  }

  
  @httpPost("/DeleteBlog")
  async deleteBlog(req:Request,res:Response, next:NextFunction){
    try{
        const delete1:any = req.find
        const {_id,userID} = req.body
        if(delete1._id === userID &&(delete1.role === "admin" || delete1.role === "author")){
            const result = await blogpostModel.findOne({_id: delete1._id , userID : userID })
            if(result){
                await this.blogpostService.deleteBlog(_id)
                res.send("BLOG SUCCESFULLY DELETED")
            }else{
                res.send("You cannot delete other's post")
            }
        }
        else{
            res.send("ONLY AUTHOR AND AUTHOR ARE UPDATED BLOG")
        }
    }
    catch(err){
        errorMessage(err,req,res,next)
    }
  }
}
