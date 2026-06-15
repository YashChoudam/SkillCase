import pg from "pg" ;
import {envConfig} from "./env.config.js" ;
import {ApiError} from "../utils/api.errors.js" ;

const {Pool} = pg ;

const pool = new Pool({
    connectionString : envConfig.databaseUrl,
    ssl: {
        rejectUnauthorized : false ,
    },
});

const connectDB = async()=>{
    try {
        await pool.query("SELECT NOW()");
        console.log("Database Connection successful ✅") ;  
    } catch (error) {
        throw new ApiError(500,"Database connection failed", [error]);
    }
};

export {pool , connectDB} ;