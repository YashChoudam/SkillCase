import dotenv from "dotenv" ;
import {ApiError} from "../utils/api.errors.js" ;

dotenv.config() ;

const requiredEnvVariables = [
    "PORT" , "DATABASE_URL" , "JWT_SECRET" , "JWT_EXPIRES_IN" , "FRONTEND_URL"
];

for(const key of requiredEnvVariables){
    if(!process.env[key]){
        throw new ApiError(500,`${key} is missing in enviornment variables`);
    }
}

const envConfig = {
    port: Number(process.env.PORT) || 5000,
    databaseUrl: process.env.DATABASE_URL as string,
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
    frontendUrl: process.env.FRONTEND_URL as string,
};

export {envConfig} ;