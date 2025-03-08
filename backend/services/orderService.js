const Cart=require('../models/cartModel')
const Product=require('../models/productModel')
const Order=require('../models/orderModel')
const CustomError=require('../utilis/customError')

exports.addOrderService=async(name,address,paymentMethod,total,userId)=>{
    const cart= await Cart.findOne({user:userId})
    if(!cart||cart.products.length===0){
        throw new CustomError('Your cart is Empty. Add items before placing an order')
    }
    const order=new Order({
        user:userId,
        items:[],
        date:new Date(),
        name,
        address,
        paymentMethod,
        total
    });
    for(let item of cart.products){
        const product=await Product.findById(item.product);
        if(!product){
            throw new CustomError(`Product with ID ${item.product} doesn't exist.`)
        }
        if(product.quantity<item.quantity){
            throw new CustomError(`Insufficient quantity for ${product.name}.`)
        }
        product.quantity -= item.quantity;
        await product.save();

        order.items.push({
            productId:item.product,
            quantity:item.quantity,
            
        })
        
    }

    await order.save();
    cart.products=[]
    await cart.save();
    return order;
}


exports.showOrderService=async(userId)=>{
    const orders=await Order.find({user:userId}).populate({path:'items.productId',select:'name price url description'})
    return {orders}
}


