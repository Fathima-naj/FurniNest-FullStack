const express=require('express')
const authenticate=require('../middlewares/authMiddleware')
const { addOrder, showOrders, verifyPayment } = require('../controllers/orderController')

const router=express.Router()

router.post('/addToOrder',authenticate,addOrder)
router.post('/verifypayment',verifyPayment)
router.get('/showOrder',authenticate,showOrders)

module.exports=router