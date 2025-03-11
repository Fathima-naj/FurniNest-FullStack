const { 
    addOrderService, 
    showOrderService, 
    verifyPaymentService 
} = require("../services/orderService");

const asyncHandler = require("../utilis/asyncHandler");
const STATUS = require("../utilis/constants");
const CustomError = require("../utilis/customError");


exports.addOrder = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { name, address, paymentMethod, total } = req.body;

    
    const { order, razorpayOrderId } = await addOrderService(name, address, paymentMethod, total, userId);

    console.log("Order Created Successfully:", order);
    console.log("Razorpay Order ID:", razorpayOrderId); 

    res.status(200).json({
        status: STATUS.SUCCESS,
        message: "Order placed successfully",
        order,
        razorpayOrderId, 
    });
});

exports.verifyPayment = asyncHandler(async (req, res) => {
    const { paymentId, orderId  } = req.body;
    
    try {
        const isPaymentVerified = await verifyPaymentService(paymentId, orderId );

        if (!isPaymentVerified) {
            throw new CustomError("Payment verification failed", 400);
        }

        res.status(200).json({
            status: STATUS.SUCCESS,
            message: "Payment verified successfully",
        });

    } catch (error) {
        console.error("Error in Payment Verification:", error);
        res.status(error.status || 500).json({
            status: STATUS.FAILURE,
            message: "Something went wrong during payment verification.",
        });
    }
});
 
exports.showOrders = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    
    const { orders } = await showOrderService(userId);

    const message = orders.length ? "Orders retrieved successfully" : "No orders found";

    console.log("Backend Orders:", orders);

    res.status(200).json({
        status: STATUS.SUCCESS,
        message,
        orders, 
    });
});
