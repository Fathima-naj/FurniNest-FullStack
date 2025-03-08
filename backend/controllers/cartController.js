const asyncHandler=require('../utilis/asyncHandler')
const STATUS=require('../utilis/constants')
const { addCartServices, getCartServices,deleteCartServices, decrementProductQuantityService, incrementProductQuantityService, clearCartServices}=require('../services/cartService')
const Cart = require('../models/cartModel')

exports.addToCart=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const userId=req.user._id
    const updatedCart=await addCartServices(productId,userId)
    res.json({status:STATUS.SUCCESS,message:'Product added to the cart successfullt',cart:updatedCart.products})
})

exports.getCart=asyncHandler(async(req,res)=>{
    const userId=req.user._id
    const cart=await getCartServices(userId)
    if(cart.products.length===0 ){
        res.status(200).json({status:STATUS.SUCCESS,message:'your cart is empty'})
    }else{
        res.status(200).json({status:STATUS.SUCCESS,message:'cart list...',cart:cart.products})
    }
})

exports.deleteCart=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const userId=req.user._id
    await deleteCartServices(productId,userId)
    res.json({status:STATUS.SUCCESS,message:'cart item deleted successfully'})
})

exports.incrementQuantity=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const userId=req.user._id
    await incrementProductQuantityService(productId,userId)
    res.json({status:STATUS.SUCCESS,message:'Product Quantity incremented successfully'})
})

exports.decrementProductQuantity=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const userId=req.user._id
   const result= await decrementProductQuantityService(productId,userId)
   console.log('Backend resp:',result)
    res.json({status:STATUS.SUCCESS,message:result.message,cart:result.cart})
})

exports.clearCart=asyncHandler(async(req,res)=>{
    const userId=req.user.id;
    const response=await clearCartServices(userId)
    res.status(200).json({status:STATUS.SUCCESS,message:response.message})
})