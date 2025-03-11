const asyncHandler=require('../utilis/asyncHandler')
const STATUS=require('../utilis/constants')
const {productService,singleProductService, addProductService, deleteProductService, updateProductService}=require('../services/productService')
const CustomError = require('../utilis/customError')


exports.getallProducts=asyncHandler(async(req,res)=>{
    const {categories,page,search}=req.query
    
    const isAdmin = req.user&& req.user.isAdmin
    const {products,pagination}=await productService({
        categories,
        search,
        page:parseInt(page,10)||1,
        limit:9,
        isAdmin
    })
    if(products.length===0){
        res.status(200).json({
            status:STATUS.ERROR,
            message:'no products found'
        })
    }
    else{
        res.status(200).json({
            status:STATUS.SUCCESS,
            products,
            pagination,
        })
    }
})

exports.singleProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    const isAdmin = req.user && req.user.isAdmin
    const product=await singleProductService(id,isAdmin)
    res.status(200).json({status:STATUS.SUCCESS,product})
})

exports.addProduct = asyncHandler(async (req, res) => {
    const { name,  ...rest } = req.body;
    if(!req.file){
        throw new CustomError('Image file is required',400)
    }
    const imageUrl = req.file.path; 
    const newProduct = await addProductService({
        name,
        url: imageUrl,
        ...rest
    });

    res.status(201).json({
        status: 'success',
        message: 'Product added successfully',
        data: newProduct
    });
});


exports.deleteProduct=asyncHandler(async(req,res)=>{
    const {productId}=req.params
    const products=await deleteProductService(productId)
    res.json({status:STATUS.SUCCESS,message: "Product deleted successfully",products})
})

exports.updateProduct=asyncHandler(async(req,res)=>{
    const {id}=req.params
    console.log('editing id',id)
    const updatedData=req.body;
    if(req.file){
       updatedData.image=req.file.path;
    }
    const updateProduct=await updateProductService(id,updatedData)
    console.log(updateProduct)
    res.status(200).json({status:STATUS.SUCCESS,message:"Produc updated successfully",updateProduct})
})