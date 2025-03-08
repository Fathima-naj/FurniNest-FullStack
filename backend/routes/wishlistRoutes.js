const express=require('express')

const authenticate=require('../middlewares/authMiddleware')
const { addToWishlist, getWishlist, deleteWishlist } = require('../controllers/wishlistController')

const router=express.Router()

router.post('/addToWishlist/:productId',authenticate,addToWishlist)
router.get('/getWishlist',authenticate,getWishlist)
router.delete('/deleteWishlist/:productId',authenticate,deleteWishlist)

module.exports=router