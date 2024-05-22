import { commentServices } from '../services'
import { NextFunction, Request, Response } from 'express'
import { controller, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../utils/types'
import errorMessage from '../utils/errorHandling'
import { commentInterface, userInterface } from '../interface'

@controller('/comment')
export class commentController {
  private commentService: commentServices
  constructor(@inject(TYPES.commentServices) commentServices: commentServices) {
    this.commentService = commentServices
  }

  @httpPost('/InsertData')
  async userData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { content, userID, blogpostID, likes, dislike } = req.body
      const body: commentInterface = {
        content,
        userID,
        blogpostID,
        likes,
        dislike
      }
      await this.commentService.commentData(body)
      res.send('COMMENT SUCCESSFULLY REGISTERED')
    } catch (err) {
      errorMessage(err, req, res, next)
    }
  }
}
