import jwt from "jsonwebtoken" ;
import type {Request , Response , NextFunction} from "express" ;

import { envConfig } from "../config/env.config.js";
import { pool } from "../config/database.config.js";
import { ApiError } from "../utils/api.errors.js";

type AuthTokenPayload = {
  id: number;
  email: string;
};

const authMiddleware = async(req: Request , res : Response , next : NextFunction) =>{
    try {
        const authHeader = req.headers.authorization ;

        if(!authHeader || !authHeader.startsWith("Bearer")){
            throw new ApiError(401 , "Unauthorized request") ;
        }

        const token = authHeader.split(" ")[1] ;
        if(!token){
            throw new ApiError(401, "Unauthorised Request") ;
        }

        const decoded = jwt.verify(
            token , 
            envConfig.jwtSecret
        ) as AuthTokenPayload ;

        const result = await pool.query(
            "SELECT id , name , email , created_at FROM users WHERE id = $1",[decoded.id]
        )
        const user = result.rows[0] ;

        if(!user){
            throw new ApiError(401, "Invalid or expired Token") ;
        }
        req.user = user ;
        next();
    } catch (error) {
        if (error instanceof ApiError){
            next(error) ;
            return ;
        }
        next(new ApiError(401, "Invalid or expired Token"));
    }
}

export {authMiddleware} ;