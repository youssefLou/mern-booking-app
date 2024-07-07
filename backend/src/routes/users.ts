import express,{Request,Response} from "express";
import User from "../models/user";
import jwt from "jsonwebtoken"
import {check, validationResult} from "express-validator"

const router = express.Router();


router.post("/register" , [
    check("firstName","first name is required").isString(),
    check("lastName","last name is required").isString(),
    check("email"," email is required").isEmail(),
    check("password","password with 6 or more characters required !!!!").isLength({min:3}),
    
],async (req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({
            message:errors.array()
        });    
    }
    try{
        let user =await User.findOne({
            email : req.body.email,
        });
        if(user){
            return res.status(400).json({message :"user already exists! "})
        }
        user=new User(req.body)
        await user.save();

        const token =jwt.sign({userId :user.id},process.env.JWT_SECRUT_KEY as string);
        res.cookie("auth_token" , token , {
            httpOnly : true,
            secure:process.env.NODE_ENV ==="production",
        })
        return res.status(200).send({message : "user registered OK "});
    }catch(error){
        console.log(error);
        res.status(500).send({message: "something went wrong !"})
    }
})

export default router ; 
