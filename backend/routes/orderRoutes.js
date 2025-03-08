const express=require('express')
const authenticate=require('../middlewares/authMiddleware')
const { addOrder, showOrders } = require('../controllers/orderController')
const { showOrderService } = require('../services/orderService')

const router=express.Router()

router.post('/addToOrder',authenticate,addOrder)
router.get('/showOrder',authenticate,showOrders)

module.exports=router