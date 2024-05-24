import { BlogpostServices } from '../services'
import { NextFunction, Request, Response } from 'express'
import { controller, httpGet, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../utils/types'
import errorMessage from '../utils/errorHandling'
import { BlogpostInterface } from '../interface'
import { Auth } from '../middleware/auth'
import { BlogpostQuery } from '../query'


@controller('/blogpost')
export class BlogpostController {
  private blogpostService: BlogpostServices
  private blogpostQuery: BlogpostQuery


  constructor(
    @inject(TYPES.BlogpostServices) blogpostServices: BlogpostServices,
    @inject(TYPES.BlogpostQuery) BlogpostQuery: BlogpostQuery
  ) {
    this.blogpostService = blogpostServices
    this.blogpostQuery = BlogpostQuery
  }

  @httpPost('/InsertData', Auth)
  async userData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {    
    try {
      const blog: any = req.find
      const { title, content, likes, dislikes, isdeleted } = req.body
      const userID = blog._id
      if (blog._id === userID && (blog.role === 'admin' || blog.role === "author")) {
        const body: BlogpostInterface = {
          title,
          content,
          userID,
          likes,
          dislikes,
          isdeleted
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
        const {_id,...updateBlog} =req.body
        const result = await this.blogpostService.updateBlog(_id,update,updateBlog)
        res.send(result)
        return
    }catch(err){
        errorMessage(err,req,res,next)
    }    
  }

  
  @httpPost("/DeleteBlog",Auth)
  async deleteBlog(req:Request,res:Response, next:NextFunction){
    try{
        const delete1:any = req.find
        const {_id} = req.body
        const result = await this.blogpostService.deleteBlog(_id,delete1)
        res.send(result)
    }
    catch(err){
      console.log(err);
        errorMessage(err,req,res,next)
    }
  }


  @httpGet('/FindBlog/:id',Auth)
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const find: any = req.find
      const { _id } = req.params
      if (find._id === _id) {
       const users =  await this.blogpostService.findAll(_id)
       res.json({users})
      }else if(find.role === "admin"){
        const { filter, search, page = 1, limit = 10 } = req.query
        const { blog , total_pages } = await this.blogpostQuery.findAll(
          filter as string,
          search as string,
          +page,
          +limit
        )
        res.json({
          total_pages,
          current_page: page,
          blog
        })
      }else{
        res.send("Wrong user ID")
      }
    } catch (err) {
      console.log(err);
      errorMessage(err, req, res, next)
    }
  }
}
