// Import from packages 

import express from "express" ;
import cors from "cors" ;


// Import from local files 
import {corsOptions} from "./config/cors.config.js" ;
import { envConfig } from "./config/env.config.js";



const app = express() ;

// Basci Configs
app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//cors config
app.use(cors(corsOptions));


// Routes




export default app ;

