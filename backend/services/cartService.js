const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const CustomError = require('../utilis/customError')

exports.addCartServices = async (productId, userId) => {
    const product = await Product.findById(productId)
    if (!product) {
        throw new CustomError('product not found', 404)
    }
    let cart = await Cart.findOne({ user: userId })
    if (!cart) {
        cart = new Cart({ user: userId, products: [] })
    }

    const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
    )
    if (existingProductIndex > -1) {
        const currentQuantity = cart.products[existingProductIndex].quantity;
        if (currentQuantity + 1 > product.quantity) {
            throw new CustomError('insufficient stock for this product', 400)
        }
        cart.products[existingProductIndex].quantity += 1
    } else {
        cart.products.push({ product: productId, quantity: 1 })
    }
    await cart.save();
    return cart;
}

exports.getCartServices = async (userId) => {
    const cart = await Cart.findOne({ user: userId }).populate('products.product')
    if (!cart) {
        cart = new Cart({ user: userId, products: [] })
        await cart.save();
    }
    return cart
}


exports.deleteCartServices = async (productId, userId) => {
    const result = await Cart.updateOne(
        { user: userId },
        { $pull: { products: { product: productId } } },
        {new:true}
    );
    // console.log('Update Result:', result);
    if (!result) {
        throw new CustomError("Cart not found for the user or product not in cart.", 401)
    }
    return result
}

exports.incrementProductQuantityService = async (productId, userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
        throw new CustomError("Cart not found", 404);
    }

    const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
    );

    if (productIndex === -1) {
        throw new CustomError("Product not found in the cart", 404);
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new CustomError("Product not found", 404);
    }

    if (cart.products[productIndex].quantity + 1 > product.quantity) {
        throw new CustomError("Insufficient stock for this product", 400);
    }

    cart.products[productIndex].quantity += 1;
    await cart.save();
    return { message: "Product quantity incremented successfully" };
};


// exports.decrementProductQuantityService = async (productId, userId) => {
//     const cart = await Cart.findOne({ user: userId });
//     if (!cart) {
//         throw new CustomError("Cart not found", 404);
//     }

//     const productIndex = cart.products.findIndex(
//         (item) => item.product.toString() === productId
//     );

//     if (productIndex === -1) {
//         throw new CustomError("Product not found in the cart", 404);
//     }

//     if (cart.products[productIndex].quantity > 1) {
//         cart.products[productIndex].quantity -= 1;
//         await cart.save();
//         return { message: "Product quantity decremented successfully"};
//     } else {
//     const updatedCart=await exports.deleteCartServices(productId, userId);
//         return { message: "Product removed from cart" ,cart:updatedCart};
//     }
// };

exports.decrementProductQuantityService = async (productId, userId) => {
    console.log("Checking Cart for User:", userId);
    console.log("Product ID to Decrement:", productId);

    const cart = await Cart.findOne({ user: userId });
    console.log("Cart Found:", cart);

    if (!cart) {
        throw new CustomError("Cart not found", 404);
    }

    const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
    );

    console.log("Product Index:", productIndex);
    console.log("Cart Products:", cart.products);

    if (productIndex === -1) {
        throw new CustomError("Product not found in the cart", 404);
    }

    if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
        await cart.save();
        return { message: "Product quantity decremented successfully", cart };
    } else {
        const updatedCart = await exports.deleteCartServices(productId, userId);
        return { message: "Product removed from cart", cart: updatedCart };
    }
};


// exports.decrementProductQuantityService = async (productId, userId) => {
//     const cart = await Cart.findOne({ user: userId });

//     if (!cart) {
//         throw new CustomError("Cart not found", 404);
//     }

//     const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

//     if (productIndex === -1) {
//         throw new CustomError("Product not found in the cart", 404);
//     }

//     if (cart.products[productIndex].quantity > 1) {
//         cart.products[productIndex].quantity -= 1;
//     } else {
//         cart.products.splice(productIndex, 1); // ✅ Remove product if quantity is 1
//     }

//     await cart.save();

//     // ✅ Return full updated cart instead of MongoDB metadata
//     return { 
//         message: "Product quantity decremented successfully", 
//         cart 
//     };
// };


exports.clearCartServices = async (userId) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, products: [] });
        await cart.save();
        return { message: "Cart is already empty" };
    }

    cart.products = []; // Clear the cart
    await cart.save();
    
    return { message: "Cart cleared successfully" };
};

