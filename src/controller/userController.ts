import { userServices } from '../services'
import { userQuery } from '../query'
import { NextFunction, Request, Response } from 'express'
import { controller, httpGet, httpPost } from 'inversify-express-utils'
import { inject } from 'inversify'
import { TYPES } from '../utils/types'
import errorMessage from '../utils/errorHandling'
import { userInterface } from '../interface'
import { STATUS_CODE, SUCCESS_MESSAGE, NOT_FOUND } from '../utils/constant'
import { Auth } from '../middleware/auth'
import { userModel } from '../models'

@controller('/user')
export class userController {
  private userService: userServices
  private userQuery: userQuery
  constructor(
    @inject(TYPES.userServices) userServices: userServices,
    @inject(TYPES.userQuery) userQuery: userQuery
  ) {
    this.userService = userServices
    this.userQuery = userQuery
  }

  @httpPost('/InsertData')
  async userData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password, profile_info } = req.body
      const body: userInterface = { name, email, password, profile_info }
      await this.userService.userData(body)
      res.send('USER SUCCESSFULLY REGISTERED')
    } catch (err) {
      errorMessage(err, req, res, next)
    }
  }

  @httpPost('/login')
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      errorMessage(err, req, res, next)
    }
  }

  @httpPost('/UpdateData', Auth)
  async updateData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const update: any = req.find
      const { _id, updateData } = req.body
      if (update._id === _id) {
        await this.userService.updateData(_id, updateData)
        res.send('DATA UPDATED')
      } else {
        res.send('your ID is Wrong')
      }
    } catch (err) {
      errorMessage(err, req, res, next)
    }
  }

  @httpPost('/DeleteData', Auth)
  async deleteData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const delete1: any = req.find
      const { _id } = req.body
      if (delete1._id === _id || delete1.role === 'admin') {
        await this.userService.deleteData(_id)
        res.send('DATA DELETED')
      } else {
        res.send('your ID is Wrong')
      }
    } catch (err) {
      errorMessage(err, req, res, next)
    }
  }

  @httpPost('/FindUser',Auth)
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const find: any = req.find
      const { _id } = req.body
      if (find._id === _id) {
       const users =  await userModel.findOne({_id})
       res.json({users})
      }else if(find.role === "admin"){
        const { filter, search, page = 1, limit = 10 } = req.query
        const { users, total_pages } = await this.userQuery.findAll(
          filter as string,
          search as string,
          +page,
          +limit
        )
        res.json({
          total_pages,
          current_page: page,
          users
        })
      }else{
        res.send("Wrong user ID")
      }
    } catch (err) {
      errorMessage(err, req, res, next)
    }
  }
}
