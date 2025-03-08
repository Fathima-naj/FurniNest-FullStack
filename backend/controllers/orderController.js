const { addOrderService, showOrderService, getTotalProductsPurchased } = require('../services/orderService')
const asyncHandler=require('../utilis/asyncHandler')
const STATUS=require('../utilis/constants')

exports.addOrder=asyncHandler(async(req,res)=>{
    const userId =req.user._id
    const {name,address,paymentMethod,total}=req.body
   const updatedOrder= await addOrderService(name,address,paymentMethod,total,userId)
   console.log(updatedOrder)
    res.status(200).json({status:STATUS.SUCCESS,message:"order success",order:updatedOrder})
})

exports.showOrders=asyncHandler(async(req,res)=>{
    const userId=req.user._id
    const orders=await showOrderService(userId)
    const message=orders.length?"Order retrieved successfully":"no orders found"
    console.log('backend order',orders)
    res.status(200).json({status:STATUS.SUCCESS,message,order:orders})
})

