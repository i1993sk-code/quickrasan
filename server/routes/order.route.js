import { Router } from 'express'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import { CashOnDeliveryOrderController, getOrderDetailsController, paymentController, webhookStripe, getAllOrdersController, adminUpdateOrderStatusController, cancelOrderByUserController } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post("/cash-on-delivery",auth,CashOnDeliveryOrderController)
orderRouter.post('/checkout',auth,paymentController)
orderRouter.post('/webhook',webhookStripe)
orderRouter.get("/order-list",auth,getOrderDetailsController)
orderRouter.post("/cancel-order",auth,cancelOrderByUserController)

orderRouter.get("/admin/orders",auth,admin,getAllOrdersController)
orderRouter.post("/admin/update-status",auth,admin,adminUpdateOrderStatusController)

export default orderRouter