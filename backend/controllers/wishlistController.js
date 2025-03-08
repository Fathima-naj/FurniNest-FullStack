const { addTowishlistServices, getWishlistServices, deleteWishlistServices } = require('../services/wishlistService')
const asyncHandler=require('../utilis/asyncHandler')
const STATUS=require('../utilis/customError')
const Favourite=require('../models/wishlistModel')

exports.addToWishlist=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const userId=req.user._id
    const updatedWishlist= await addTowishlistServices(productId,userId)
    console.log('wishlist',updatedWishlist)
    res.json({status:STATUS.SUCCESS,message:'Product added to wishlist',wishlist:updatedWishlist.wishlist})
})

exports.getWishlist=asyncHandler(async(req,res)=>{
    const userId=req.user._id
    const userFav=await getWishlistServices(userId)
    if(userFav.wishlist.length===0 ){
        res.status(200).json({status:STATUS.SUCCESS,message:'your wishlist is empty'})
    }else{
        res.status(200).json({status:STATUS.SUCCESS,message:'Wishlist...',wishlist:userFav.wishlist})
    }
})


exports.deleteWishlist=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const userId=req.user._id
   const updated= await deleteWishlistServices(productId,userId)
    res.json({status:STATUS.SUCCESS,message:'delete wishlist  success'})
})

