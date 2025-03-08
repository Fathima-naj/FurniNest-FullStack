const cloudinary = require('../config/cloudinary');
const Product = require('../models/productModel');
const CustomError = require('../utilis/customError');

const uploadCloudinary = async (req, res, next) => {
    if (!req.file) {
        return next(new CustomError('Image file is required', 400));
    }

    // ✅ Step 1: Check if Product Already Exists BEFORE Uploading
    const { name } = req.body;
    const existingProduct = await Product.findOne({ name, isDelete: false });

    if (existingProduct) {
        return next(new CustomError('Product already exists', 400));
    }

    try {
        // ✅ Step 2: Upload Image to Cloudinary (Only If Product Doesn’t Exist)
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
            folder: 'products',
        });

        // ✅ Attach Cloudinary details to request body
        req.body.imageUrl = uploadedImage.secure_url;
        req.body.publicId = uploadedImage.public_id;

        next(); // Move to Controller
    } catch (error) {
        return next(new CustomError('Image upload failed', 500));
    }
};

module.exports = uploadCloudinary;
