const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const Order = require("../models/orderModel");
const CustomError = require("../utilis/customError");
const razorpayInstance = require("../config/razorpay.jsx");


exports.addOrderService = async (name, address, paymentMethod, total, userId) => {
 
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.products.length === 0) {
        throw new CustomError("Your cart is empty. Add items before placing an order.");
    }

    const order = new Order({
        user: userId,
        items: [],
        date: new Date(),
        name,
        address,
        paymentMethod,
        total,
        razorpayPaymentStatus: "pending",
    });

   
    for (let item of cart.products) {
        const product = await Product.findById(item.product);
        if (!product) {
            throw new CustomError(`Product with ID ${item.product} doesn't exist.`);
        }
        if (product.quantity < item.quantity) {
            throw new CustomError(`Insufficient quantity for ${product.name}.`);
        }

        
        product.quantity -= item.quantity;
        await product.save();

      
        order.items.push({
            productId: item.product,
            quantity: item.quantity,
        });
    }
    await order.save();

  
    cart.products = [];
    await cart.save();

    let razorpayOrderId = null;
    let amount = total * 100; 

  
    if (paymentMethod === "razorpay") {
        const options = {
            amount: amount,
            currency: "INR",
            receipt: `order_receipt_${order._id}`,
            payment_capture: 1,
        };

        try {
            console.log("Creating Razorpay order with options:", options);
            const razorpayOrder = await razorpayInstance.orders.create(options);
            console.log("Razorpay order created successfully:", razorpayOrder);

            order.razorpayOrderId = razorpayOrder.id;
            await order.save();
            razorpayOrderId = razorpayOrder.id;
        } catch (error) {
            console.error("Error creating Razorpay order:", error);
            throw new CustomError("Razorpay order creation failed.");
        }
    }

    console.log("Order Object Before Response:", order);
    console.log("Razorpay Order ID:", razorpayOrderId);

    return {
        order,
        razorpayOrderId,
        amount,
    };
};


exports.verifyPaymentService = async (paymentId, orderId) => {
    console.log("Verifying Payment with:", { paymentId, orderId });

    if (!orderId) {
        throw new CustomError("Razorpay Order ID is missing!", 400);
    }

 
    const order = await Order.findOne( { razorpayOrderId: orderId });
    if (!order) {
        console.error(`Order not found for Razorpay Order ID: ${orderId}`);
        throw new CustomError("Order not found for the given Razorpay Order ID", 400);
    }

    try {
        
        const paymentDetails = await razorpayInstance.payments.fetch(paymentId);
        console.log("Fetched Razorpay Payment Details:", paymentDetails);

        if (!paymentDetails.order_id || paymentDetails.order_id !== orderId) {
            console.error("Mismatch between stored order ID and Razorpay payment details");
            throw new CustomError("Payment details do not match the order", 400);
        }

        
        if (paymentDetails.status === "captured") {
            order.razorpayPaymentStatus = "paid";
            order.status = "placed";
        } else {
            order.razorpayPaymentStatus = paymentDetails.status;
            order.status = "pending"; 
        }

        await order.save();
        console.log("Payment Verified Successfully:", order);

        return {
            success: true,
            message: "Payment verified successfully",
            paymentStatus: order.razorpayPaymentStatus,
            order
        };

    } catch (error) {
        console.error("Error during payment verification:", error);
        throw new CustomError("Payment verification failed", 500);
    }
};



exports.showOrderService = async (userId) => {
    const orders = await Order.find({ user: userId })
        .populate({ path: "items.productId", select: "name price url description" });

    return { orders };
};
