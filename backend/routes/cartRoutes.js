const express=require('express')
const {addToCart, getCart, deleteCart, incrementQuantity, decrementProductQuantity, clearCart}=require('../controllers/cartController')
const authenticate=require('../middlewares/authMiddleware')

const router=express.Router()

router.post('/addToCart/:productId',authenticate,addToCart)
router.get('/getCart',authenticate,getCart)
router.delete('/deleteCart/:productId',authenticate,deleteCart)
router.put('/increment/:productId',authenticate,incrementQuantity)
router.put('/decrement/:productId',authenticate,decrementProductQuantity)
router.delete('/clearCart',authenticate,clearCart)
module.exports=router