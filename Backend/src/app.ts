// Import from packages 

import express from "express" ;
import cors from "cors" ;


// Import from local files 
import {corsOptions} from "./config/cors.config.js" ;

// Import of routes
import {authRouter} from "./routes/auth.routes.js" ;
import { videoRouter } from "./routes/video.routes.js";
import { errorMiddleware } from "./middlewares/error.middleware.js";

const app = express() ;

// Basci Configs
app.use(express.json({ limit: "16kb" })); 
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//cors config
app.use(cors(corsOptions));


// Routes
app.use("/auth", authRouter) ;
app.use("/uploads", express.static("src/uploads"));
app.use("/videos", videoRouter);

app.use(errorMiddleware);


export default app ;

