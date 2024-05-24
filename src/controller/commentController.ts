import { CommentServices } from '../services'
import { NextFunction, Request, Response } from 'express'
import { controller, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../utils/types'
import errorMessage from '../utils/errorHandling'
import { CommentInterface } from '../interface'
import { Auth } from '../middleware/auth'
@controller('/comment')
export class CommentController {
  private commentService: CommentServices
  constructor(@inject(TYPES.CommentServices) commentServices: CommentServices) {
    this.commentService = commentServices
  }

  @httpPost('/InsertComment/:id',Auth)
  async userData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<CommentInterface | object> {
    try {
      const blog: any = req.find;
      console.log(req.params);
      let  blogpostID : any  = req.params.id;
      const { content, likes, dislike, isdeleted } = req.body;
      const userID = blog._id;
      const body = {
        content,
        userID,
        blogpostID,
        likes,
        dislike,
        isdeleted
      };
      const result = await this.commentService.commentData(blogpostID, body);
      res.send(result);
      return
    } catch (err) {
      errorMessage(err, req, res, next);
    }
    
  }

  @httpPost("/UpdateComment/:id",Auth)
  async updateComment(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try{
      const update:any = req.find
      const _id : any = req.params.id
        const {blogpostID, ...updateComment} =req.body
           const result = await this.commentService.updateComment(_id,blogpostID,update,updateComment)
           res.send(result)
           return
    }catch(err){
      console.log(err)
        errorMessage(err,req,res,next)
    }     
  }

  @httpPost("/DeleteComment/:id",Auth)
  async deleteBlog(req:Request,res:Response, next:NextFunction){
    try{
        const delete1:any = req.find
        const _id:any = req.params.id
        const {blogpostID} = req.body
        const result = await this.commentService.deleteComment(_id,blogpostID,delete1)
        res.send(result)
        return
    }
    catch(err){
      console.log(err);
        errorMessage(err,req,res,next)
    }
  }

}
