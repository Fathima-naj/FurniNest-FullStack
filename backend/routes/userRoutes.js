const express=require("express")
const router=express.Router();
const {registerUser, loginUser, getLoggedInUser, logoutUser, refreshToken}=require('../controllers/userController');
const authenticate = require("../middlewares/authMiddleware");

router.post('/register',registerUser)
router.post('/login',loginUser)
router.post('/refreshToken',refreshToken)
router.get('/me',authenticate,getLoggedInUser)
router.post('/logout',logoutUser)

 module.exports=router;