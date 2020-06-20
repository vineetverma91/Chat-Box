import { validationResult } from "express-validator";
import { getEnviromentVariables } from "../enviroments/env";
import * as JWT from "jsonwebtoken";

export class GlobalMiddleware {
    static checkError(req, res, next) {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            next(new Error(error.array()[0].msg));
            return;
        } else {
            next();
        }
    }

    static async authenticate(req,res,next) {
       const authHeader = req.headers.authorization;
       const token = authHeader ? authHeader.slice(7,authHeader.length): null;

       try {
           // 401 error type is indicate by unauthorize user
           req.errorstatus = 401;
           JWT.verify(token, getEnviromentVariables().jwt_secretkey, ((error, decoded) => {
             if (error) {
                 next(error);
             } else if(!decoded){
                 next(new Error('User Not Authorised'))
             } else {
                 req.user = decoded;
                 next();
             }
           }))
       } catch (error) {
           next(error);
       }
    }
}