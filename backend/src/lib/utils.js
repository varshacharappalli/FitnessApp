import jwt from 'jsonwebtoken';

export const generateToken=(user_id,res)=>{
    const token=jwt.sign({user_id},process.env.SECRET_KEY,{expiresIn:"7d"})
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpsOnly:true,
        sameSite:"strict",
        secure: process.env.NODE_ENV !== "development"

    });

    return token;

}