const User=require('../models/User')
const CustomError=require('../utilis/customError')
const Order=require('../models/orderModel')

exports.getAllUserService=async(limits,skips)=>{
    const usersList=await User.find({isAdmin:{$ne:true}})
    .skip(skips)
    .limit(limits);
    const totalUsers=await User.countDocuments({isAdmin:{$ne:true}});
    return {usersList,totalUsers}
}

exports.singleUserService=async(id)=>{
    const users=await User.findById(id);
    if(!users){
        throw new CustomError('user not found',400);
    }
    return users
}

exports.userBlockService=async(id)=>{
    const userDetails=await User.findById(id);
    if(!userDetails){
        throw new CustomError('user not found',400);
    }
    userDetails.isBlock=!userDetails.isBlock;
    userDetails.save();
    return userDetails;
}



exports.getTotalProductsPurchased=async()=>{
    const result=await Order.aggregate([
        {$unwind:"$items"},
        {$group:{
            _id:null,
            totalPurchased:{$sum:"$items.quantity"}
        }}
    ]);
    return result.length>0?result[0].totalPurchased:0
}

exports.totalRevenueService=async()=>{
    const result=await Order.aggregate([
        {$group:{_id:null,totalRevenue:{$sum:"$total"}}}
    ]);
    return result;
}


// exports.getAllOrders = async () => {
//     const orders = await Order.find()  
//        .populate('user','name email')  
//         .populate("items.productId", "name price");  
//     if(!orders.length){
//         throw new CustomError('no orders found',404)
//     }
//     return orders;
// };


exports.showOrderServices = async (userId, page = 1, limit = 10) => {
    const skip = (page - 1) * limit; 
    const total = await Order.countDocuments({ user: userId });
    const orders = await Order.find({ user: userId })
      .populate( 'items.productId' )
      .skip(skip)
      .limit(limit);
      
      if (!orders.length) {
        throw new CustomError("No orders found for this user", 404);
    }
    return {
      orders,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  };