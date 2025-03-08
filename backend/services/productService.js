const Product=require('../models/productModel')
const CustomError=require('../utilis/customError')
const cloudinary=require('../config/cloudinary')
exports.productService=async({categories,search,page=1,limit=10,isAdmin})=>{
    const query= isAdmin ? {}:{isDelete:false}
    if(search){
        query.$or=[
            {name:{$regex:search,$options:'i'}},
            {categories:{$regex:search,$options:'i'}}
        ]
    }

    if(categories){
        query.categories={$regex:`^${categories}$`,$options:"i"}
    }
    
    const skip=(page-1)*limit
    const total=await Product.countDocuments(query)
    const product=await Product.find(query).skip(skip).limit(limit)
    
    return {
        products:product,
        pagination:{
            total,
            page,
            limit,
            totalPages:Math.ceil(total/limit)
        }
    }
}

exports.singleProductService=async(id,isAdmin)=>{
    const query = isAdmin ? { _id: id } : { _id: id, isDelete: false };
    const existingproduct=await Product.findOne(query)
    if(!existingproduct){
        throw new CustomError('product is not available',404)

    }
    return existingproduct
}

exports.addProductService = async ({ name, url, ...rest }) => {
    const existingItem = await Product.findOne({ name, isDelete: false });
    if (existingItem) {
        throw new CustomError('Product already exists', 400);
    }
    const newProduct = new Product({ name, url, ...rest });
    await newProduct.save();
    return newProduct;
};


exports.deleteProductService=async(productId)=>{
    const existingProduct=await Product.findById(productId)
    if(!existingProduct){
        throw new CustomError('Product is unavailable',400)
    }
    const updated= await Product.findByIdAndUpdate(productId,{isDelete: !existingProduct.isDelete},{new:true})
    return updated
}

exports.updateProductService=async(_id,updateItems)=>{
    const existingProduct=await Product.findById(_id)
    if(!existingProduct){
        throw new CustomError("Product is unavailable",400)
    }
    const data=await Product.findByIdAndUpdate(_id,{$set:{isDelete:false,...updateItems}},{new:true})
    return data
}