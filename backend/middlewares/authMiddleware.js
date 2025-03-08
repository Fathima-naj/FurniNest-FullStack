const User=require('../models/User')
const CustomError=require('../utilis/customError')
const{verifyToken}=require('../utilis/jwt')

const authenticate=async(req,res,next)=>{
    try{
        console.log("cookies",req.cookies)
        const token=req.cookies.accessToken
        // if(!token && req.cookies.refreshToken){
        //     throw new CustomError('Access token is missing',401)
        // }
        if(!token){
            throw new CustomError("Access token is missing",401)
        }
        
        const decoded=verifyToken(token,process.env.JWT_SECRET)
        if(!decoded){
        throw new CustomError("Invalid or expired refresh Token",403)
        } 
        const user=await User.findById(decoded.id)
        if(!user){
            throw new CustomError('user not found',404)
        }
        req.user=user
        next()
     }catch(err){
        next(err)
     }
}

module.exports=authenticate