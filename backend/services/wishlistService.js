const Favourite = require("../models/wishlistModel");
const CustomError=require('../utilis/customError')
const Product=require('../models/productModel')

exports.addTowishlistServices=async(productId,userId)=>{
    const product=await Product.findById(productId)
    if(!product){
        throw new CustomError ('product not found',404)
    }
    let userFavourite=await Favourite.findOne({user:userId})
    if(!userFavourite){
        userFavourite=new Favourite({user:userId,wishlist:[]})
    }

    const isProductWishlist=userFavourite.wishlist.some(
        (item)=>item.toString()===productId
    )
    if(isProductWishlist){
      throw new CustomError('Product is already in wishlist')
    }
    userFavourite.wishlist.push(productId)
    await userFavourite.save()
    return userFavourite;
}

exports.getWishlistServices=async(userId)=>{
    const userFavourite=await Favourite.findOne({user:userId}).populate('wishlist')
    if(!userFavourite){
        userFavourite=new Favourite({user:userId,wishlist:[]})
        await userFavourite.save();
    }
    return userFavourite
}


exports.deleteWishlistServices=async(productId,userId)=>{
    const result = await Favourite.updateOne(
        {user:userId},
        {$pull: {wishlist:productId}},
        {new:true}
    );
    // console.log('Update Result:', result);
    if(!result){
        throw new CustomError("wishlist not found for the user or product not in wishlist.", 401)
    } 
}
