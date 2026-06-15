// Import from packages 
import dotenv from "dotenv" ;

// Import from local files ;

import app from "./app.js" ;
import {ApiError} from "./utils/api.errors.js";
import {ApiResponse} from "./utils/api.response.js";
import {envConfig} from "./config/env.config.js" ;
import { connectDB } from "./config/database.config.js";


dotenv.config({
    path : "../.env" 
})


connectDB()
    .then(()=>{
        app.listen(envConfig.port,()=>{
            console.log(`Server running on : http://localhost:${envConfig.port}`);
        })
    })
    .catch((error)=>{
        throw new ApiError(500, "Supabase connection Error") ;
    });