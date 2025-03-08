const mongoose=require('mongoose')

const ProductSchema=new mongoose.Schema({
    name:{type:String,required:true},
    price:{type:Number,required:true},
    quantity:{type:Number,required:true},
    description:{type:String,required:true},
    categories:{type:String,required:true},
    url:{type:String,required:true},
    isDelete:{type:Boolean,required:true,default:false}
})

const Product=mongoose.model('Product',ProductSchema)
module.exports=Product