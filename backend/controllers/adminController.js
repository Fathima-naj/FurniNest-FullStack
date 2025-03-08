const asyncHandler=require('../utilis/asyncHandler');
const STATUS=require('../utilis/constants')
const {getAllUserService,singleUserService, userBlockService,getTotalProductsPurchased, totalRevenueService, getAllOrders, showOrderServices}=require('../services/adminService');

exports.allUsers=asyncHandler(async(req,res)=>{
    const {page}=req.query;
    const pageInt=parseInt(page,10)||1;
    const limit=10;
    skip=(pageInt-1)*limit;
    const {usersList,totalUsers}=await getAllUserService(limit,skip);
    const message=usersList.length?"User list":"No users found";
    const totalPages=Math.ceil(totalUsers/limit);
    res.json({
        status:STATUS.SUCCESS,
        message,
        data:{users:usersList,totalUsers,totalPages,currentPage:pageInt},
    })
})

exports.singleUsers=asyncHandler(async(req,res)=>{
    const {id}=req.params;
    const user=await singleUserService(id);
    res.json({status:STATUS.SUCCESS,message:"user details...",user})
})

exports.userBlock=asyncHandler(async(req,res)=>{
    const {id} =req.params;
    const user =await userBlockService(id)
    const message=user.isBlock ?"User is Block":"User is unblock";
    res.json({status:STATUS.SUCCESS,message})
});

exports.getTotalPurchased=asyncHandler(async(req,res)=>{
    const totalPurchased=await getTotalProductsPurchased();
    res.status(200).json({status:STATUS.SUCCESS,message:'Total product purchased retrieved successfully',totalPurchased})
})

exports.totalRevenue=asyncHandler(async(req,res)=>{
    const totalProfit=await totalRevenueService();
    const total= totalProfit.length>0?totalProfit[0].totalRevenue:0;
    res.json({status:STATUS.SUCCESS,message:"Total Revenue",total});
})

// exports.AllOrders = asyncHandler(async (req, res) => {
//     const orders = await getAllOrders();
//     res.json({ status: STATUS.SUCCESS, message: "Orders retrieved successfully", orders });
// });

exports.getUserOrder = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { page } = req.query; 
    const { orders,
        pagination} = await showOrderServices(
          id,
      parseInt(page, 10) || 1, 
      10 
    );
    const message = orders.length 
    ? "Orders retrieved successfully" 
    : "No orders found";
    res.status(200).json({
      status: STATUS.SUCCESS,
      message,
      orders,
      pagination
  
    });
  
         });
