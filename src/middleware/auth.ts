import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { BaseMiddleware } from 'inversify-express-utils'
import dotenv from 'dotenv'
import { userModel } from '../models'

dotenv.config()
const secretkey = process.env.SECRETKEY || ''

export class Auth extends BaseMiddleware {
  handler(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies.token

    if (!token) {
      res.status(401).send('Unauthorized')
      return
    }

    jwt.verify(token, secretkey, (err: any, decoded: any) => {
      if (err) {
        res.status(403).send('Forbidden')
        return
      }
      const user = userModel.find({ email: decoded.email })
      if (!user) {
        throw new Error('User Not Exists')
      }
      console.log(req.find)
      req.find = decoded // Assuming the decoded token contains user information
      next()
    })
  }
}
