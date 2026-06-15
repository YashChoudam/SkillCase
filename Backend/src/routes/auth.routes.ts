// Import from packages 
import {Router} from "express" ;



// Import form local files 
import {registerUser,loginUser, getCurrentUser} from "../controller/auth.controller.js" ;
import { authMiddleware } from "../middlewares/auth.middleware.js";

const authRouter = Router() ;

authRouter.route("/register").post(registerUser) ;
authRouter.route("/login").post(loginUser) ;
authRouter.route("/me").get(authMiddleware,getCurrentUser) ;

export {authRouter};