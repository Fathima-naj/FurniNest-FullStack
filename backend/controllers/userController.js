const {registerValidation,loginValidation}=require('../validation/userValidation')
const {userResgisterServices,refreshAccessTokenService, userLoginServices, getUserDetails, logoutUserService}=require('../services/userService')
const CustomError=require('../utilis/customError')
const asyncHandler=require('../utilis/asyncHandler')
const STATUS=require('../utilis/constants')
const { generateAccessToken, generateRefreshToken } = require('../utilis/jwt')

exports.registerUser=asyncHandler(async(req,res)=>{

    const data=req.body;
    const {error}=registerValidation.validate(data)
    if(error) throw new CustomError(error.details[0].message,400)
    await userResgisterServices(data);
    res.status(201).json({
        status:STATUS.SUCCESS,
        message:"User registered successfully"})
})


exports.loginUser=asyncHandler(async(req,res)=>{
    const {email,password}=req.body;
    const {error}=loginValidation.validate({email,password})
    if(error) throw new CustomError(error.details[0].message,400)
    const User = await userLoginServices(email,password);

    const accessToken=generateAccessToken(User);
    const refreshToken=generateRefreshToken(User);
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    res
    .cookie("accessToken",accessToken,{
        httpOnly:true,
        secure:false,
        maxAge:30*60*1000,

    })
    .cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:false,
        maxAge:7*24*60*60*1000,
    })
    .status(200)
    .json({
        status:STATUS.SUCCESS,
        message:User.isAdmin
        ?'Admin Login successfully'
        :"User login successfully",
        user: {
            _id: User._id,
            name: User.name,
            email: User.email,
            isAdmin: User.isAdmin,
          },
    });
});


//new access token generating
exports.refreshToken=asyncHandler(async(req,res)=>{
    const {refreshToken}=req.cookies;
    const {newAccessToken}=await refreshAccessTokenService(refreshToken)
    res
    .cookie("accessToken",newAccessToken,{
        httpOnly:true,
        secure:false,
        maxAge:15*60*1000,
    })
    .status(200)
    .json({
        status:STATUS.SUCCESS,
        message:"Access token refreshed"
    })
})


exports.getLoggedInUser = asyncHandler(async (req, res) => {
    const user = await getUserDetails(req.user._id);  
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    res.status(200).json({user})
});

exports.logoutUser = asyncHandler(async (req, res) => {
    await logoutUserService();
  
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/'
    });
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: '/'
    });
  
    res.status(200).json({ message: 'Logged out successfully' });
  });
  
