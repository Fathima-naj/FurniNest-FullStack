const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
    items:[
        {
            productId:{type:mongoose.Schema.Types.ObjectId,ref:"Product",required:true},
            quantity:{type:Number,required:true},
        },
    ],
    date:{type:Date,default:Date.now,required:true},
    name:{type:String},
    address:{type:String,required:true},
    paymentMethod:{type:String,required:true},
    total:{type:Number,required:true},
    razorpayOrderId: {
        type: String,
      },
      razorpayPaymentId: {
        type: String,
      },
      status: {
        type: String,
        enum: ["placed", "shipped", "delivered", "pending", "cancelled"],
      },
      razorpayPaymentStatus: {
        type: String,
        enum: ["paid", "failed", "pending", "captured", "refunded"],
        default: "pending",
      },
    },
    {timestamps:true}

)

const Order=mongoose.model('Order',orderSchema)
module.exports=Order;