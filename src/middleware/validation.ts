import { Request, Response, NextFunction } from 'express';
import * as yup from 'yup';
import { validation } from '../validator';
import { STATUS_CODE } from '../utils/constant';

const schemas: { [key: string]: yup.Schema<any> } = {
    '/user/InsertData': validation.userSchema,
    '/blogpost/InsertData': validation.blogSchema,
    '/comment/InsertComment/:id': validation.commentSchema
   
};

export function validateData(req: Request, res: Response, next: NextFunction) {
    const route = req.path;
    const schema = schemas[route];
    if (!schema) {
    
        return next();
    } 

   
    schema.validate(req.body, { abortEarly: false })
        .then(() => {
          
            next();
        })
        .catch((error: yup.ValidationError) => {
           
            const validationErrors = error.errors;
            res.status(STATUS_CODE.BAD_REQUEST).json({ error: 'Validation Error', validationErrors });
        });
}
