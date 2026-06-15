// Import from packages 

import bcrypt from "bcrypt" ;

// Import from local files of the project 
import {pool} from "../config/database.config.js" ;
import {ApiError} from "../utils/api.errors.js" ;
import {ApiResponse} from "../utils/api.response.js" ;
import {asyncHandler} from "../utils/asyncHandler.js" ;
import {generateToken} from "../utils/generateToken.js" ;

const registerUser = asyncHandler(async(req,res)=>{
    const  {name , email , password} = req.body ;

    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email]
    );

    if (existingUser.rows.length > 0) {
        throw new ApiError(409 , "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
        `INSERT INTO users(name,email,password_hash)
        VALUES($1, $2, $3)
        RETURNING id, name, email, created_at`,
        [name , email , hashedPassword] 
    );

    const createdUser = result.rows[0] ;
    return res.status(201).json(
        new ApiResponse(
            201 , {user : createdUser} , "User created successfully"
        )
    );
});

const loginUser = asyncHandler(async (req,res)=>{
    const {email , password } = req.body ;
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1",[email]
    );
    const user = result.rows[0];

    if(!user){
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password , user.password_hash);
    
    if(!isPasswordValid){
        throw new ApiError(401 , "Invalid email or password");
    }
    const token = generateToken(user.id,user.email);

    return res.status(200).json(
        new ApiResponse(
            200 ,
            {
                user : {
                    id : user.id ,
                    name : user.name ,
                    email : user.email ,
                    created_at : user.created_at,
                },
                token,
            },
            "Login Successfult"
        )
    );
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(
    new ApiResponse(
      200,
      { user: req.user },
      "Current user fetched successfully"
    )
  );
});

export {registerUser , loginUser , getCurrentUser} ;