import type {CorsOptions} from "cors" ;
import {envConfig} from "./env.config.js" ;

const corsOptions : CorsOptions = {
    origin : envConfig.frontendUrl ,
    credentials : true ,
    methods : ["GET" , "POST" , "PUT" , "PATCH" , "DELETE"],
    allowedHeaders : ["Content-Type" , "Authorization"],
};

export {corsOptions} ;