const User=require('../models/User')
const CustomError=require('../utilis/customError')
const bcrypt=require('bcryptjs')
const {generateAccessToken,verifyToken}=require('../utilis/jwt')

//register user service
exports.userResgisterServices=async(data)=>{
    const userExist=await User.findOne({email:data.email})
    if(userExist){
        throw new CustomError("User already exist",400)
    }
    const hashPassword=await bcrypt.hash(data.password,10)
    const newUser=new User({
        name:data.name,
        email:data.email,
        password:hashPassword,
        username:data.username,
    });
    const savedUser=await newUser.save()
    return savedUser._id;
}


//login user service
exports.userLoginServices=async(email,password)=>{
    const userData=await User.findOne({email})
    if(!userData){
        throw new CustomError("Invalid email or Password",401)
    }
    const isMatch=await bcrypt.compare(password,userData.password)
    if(!isMatch){
        throw new CustomError("Invalid Email or Password",401)
    }
   console.log('user logged in successfully')
    return userData
}

exports.refreshAccessTokenService=async(refreshToken)=>{

    //refresh token exists
    if(!refreshToken){
        throw new CustomError("Refresh token missing",401)
    }
    //verify refresh token
    const decoded=verifyToken(refreshToken,process.env.JWT_REFRESH_SECRET)
    if(!decoded){
        throw new CustomError("Invalid or expired refresh token", 403)
    }
    const user=await User.findById(decoded.id)
    if(!user){
        throw new CustomError("User not found",404)
    }
    const newAccessToken=generateAccessToken(user)
    return {newAccessToken}
}

exports.getUserDetails = async (id) => {
    const user = await User.findById(id).select('username role');
    return user;
};

exports.logoutUserService=async()=>{
    return true;
}