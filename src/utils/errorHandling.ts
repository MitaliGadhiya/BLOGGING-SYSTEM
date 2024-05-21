import { Request, Response, NextFunction } from "express";
import {STATUS_CODE} from './constant'

export const errorMessage = (err: any, req:Request, res: Response, next:NextFunction)=>{
    try{
        let error = ""
        let statusCode = 500


        switch(err.name){
            case 'MongoError':
            if(err.code === 11000){
                error = "Duplicate Field Value Entered";
                statusCode = STATUS_CODE.NOT_FOUND
            }
            break
            
            case 'MongooseError':
                error = "connection issue";
                statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR
            break
            

            case 'SyntaxError':
            error = 'Unexpected Syntax'
            statusCode = STATUS_CODE.BAD_REQUEST
            break

            case 'CastError':
            error = 'Please provide a valid ID'
            statusCode = STATUS_CODE.BAD_REQUEST
            break

            case 'TokenNotFoundError':
            error = 'Token Not Found'
            statusCode = STATUS_CODE.NOT_FOUND
            break

            case 'TokenExpiredError':
            error = 'JWT expired'
            statusCode = STATUS_CODE.UNAUTHORIZED
            break

            case 'JsonWebTokenError':
            error= 'JWT malformed'
            statusCode = STATUS_CODE.UNAUTHORIZED
            break

            case 'ForbiddenError':
            error = "Not permitted Because you aren't admin "
            statusCode = STATUS_CODE.FORBIDDEN
            break

            case 'ValidationError':
                error = err.message || 'Validation Failed'
                statusCode = STATUS_CODE.BAD_REQUEST
                break

            // case 'CategoryNotFoundError':
            // error = 'The Category you are looking for is not found '
            // statusCode = STATUS_CODE.NOT_FOUND
            // break

            default:
            error = 'Server Error'
            statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR
            break
        }

        console.log('Custom Error Handler => ', err.name, error, statusCode)

        if (res) {
            return res.status(statusCode).json({
            success: false,
            error: error
            })
            } else {
                throw new Error('Response object is not defined')
            }
    } catch (error) {
    next(error) // Forward the error to the next error handler
  }
}

export default errorMessage
