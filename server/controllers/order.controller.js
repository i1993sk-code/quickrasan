import StripeInstance from "../config/Stripe.js";
import CartProductModel from "../models/cartproduct.model.js";
import OrderModel from "../models/order.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";

 export async function CashOnDeliveryOrderController(request,response){
    try {
        const userId = request.userId
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body

        const groupOrderId = `GRP-${new mongoose.Types.ObjectId()}`

        const payload = list_items.map(el => {
            return({
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                groupOrderId : groupOrderId,
                productId : el.productId._id,
                product_details : {
                    name : el.productId.name,
                    image : el.productId.image,
                    price : el.productId.price,
                    discount : el.productId.discount,
                },
                quantity : el.quantity || 1,
                paymentId : "",
                payment_status : "CASH ON DELIVERY",
                delivery_address : addressId,
                subTotalAmt  : subTotalAmt,
                totalAmt  :  totalAmt,
                order_status : "Pending",
                delivery_status : "Pending",
            })
        })

        const generatedOrder = await OrderModel.insertMany(payload)

        const removeCartItems = await CartProductModel.deleteMany({ userId : userId })
        const updateInUser = await UserModel.updateOne({ _id : userId }, { shopping_cart : []})

        return response.json({
            message : "Order successfully",
            error : false,
            success : true,
            data : generatedOrder
        })

    } catch (error) {
        return response.status(500).json({
            message : error.message || error ,
            error : true,
            success : false
        })
    }
}

export const pricewithDiscount = (price,dis = 1)=>{
    const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100)
    const actualPrice = Number(price) - Number(discountAmout)
    return actualPrice
}

export async function paymentController(request,response){
    try {
        const userId = request.userId // auth middleware 
        const { list_items, totalAmt, addressId,subTotalAmt } = request.body 

        const user = await UserModel.findById(userId)

        const line_items  = list_items.map(item =>{
            return{
               price_data : {
                    currency : 'inr',
                    product_data : {
                        name : item.productId.name,
                        images : item.productId.image,
                        metadata : {
                            productId : item.productId._id
                        }
                    },
                    unit_amount : pricewithDiscount(item.productId.price,item.productId.discount) * 100   
               },
               adjustable_quantity : {
                    enabled : true,
                    minimum : 1
               },
               quantity : item.quantity 
            }
        })

        const params = {
            submit_type : 'pay',
            mode : 'payment',
            payment_method_types : ['card'],
            customer_email : user.email,
            metadata : {
                userId : userId,
                addressId : addressId
            },
            line_items : line_items,
            success_url : `${process.env.FRONTEND_URL}/success`,
            cancel_url : `${process.env.FRONTEND_URL}/cancel`
        }

        const session = await StripeInstance.checkout.sessions.create(params)

        return response.status(200).json(session)

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}


const getOrderProductItems = async({
    lineItems,
    userId,
    addressId,
    paymentId,
    payment_status,
 })=>{
    const productList = []
    const groupOrderId = `GRP-${new mongoose.Types.ObjectId()}`

    if(lineItems?.data?.length){
        for(const item of lineItems.data){
            const product = await StripeInstance.products.retrieve(item.price.product)

            const paylod = {
                userId : userId,
                orderId : `ORD-${new mongoose.Types.ObjectId()}`,
                groupOrderId : groupOrderId,
                productId : product.metadata.productId, 
                product_details : {
                    name : product.name,
                    image : product.images
                },
                quantity : item.quantity || 1,
                paymentId : paymentId,
                payment_status : payment_status,
                delivery_address : addressId,
                subTotalAmt  : Number(item.amount_total / 100),
                totalAmt  :  Number(item.amount_total / 100),
                order_status : "Pending",
                delivery_status : "Pending",
            }

            productList.push(paylod)
        }
    }

    return productList
}

//http://localhost:8080/api/order/webhook
export async function webhookStripe(request,response){
    const event = request.body;
    const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY

    console.log("event",event)

    // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      const lineItems = await StripeInstance.checkout.sessions.listLineItems(session.id)
      const userId = session.metadata.userId
      const orderProduct = await getOrderProductItems(
        {
            lineItems : lineItems,
            userId : userId,
            addressId : session.metadata.addressId,
            paymentId  : session.payment_intent,
            payment_status : session.payment_status,
        })
    
      const order = await OrderModel.insertMany(orderProduct)

        console.log(order)
        if(Boolean(order[0])){
            const removeCartItems = await  UserModel.findByIdAndUpdate(userId,{
                shopping_cart : []
            })
            const removeCartProductDB = await CartProductModel.deleteMany({ userId : userId})
        }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({received: true});
}


export async function getOrderDetailsController(request,response){
    try {
        const userId = request.userId

        const orderlist = await OrderModel.find({ userId : userId }).sort({ createdAt : -1 }).populate('delivery_address')

        return response.json({
            message : "order list",
            data : orderlist,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function getAllOrdersController(request,response){
    try {
        const orders = await OrderModel.find()
            .sort({ createdAt : -1 })
            .populate('delivery_address')
            .populate('userId', 'name email mobile')

        return response.json({
            message : "all orders",
            data : orders,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function adminUpdateOrderStatusController(request,response){
    try {
        const { orderIds, delivery_status, cancel_reason } = request.body

        if(!orderIds || !Array.isArray(orderIds) || orderIds.length === 0){
            return response.status(400).json({
                message : "Order IDs are required",
                error : true,
                success : false
            })
        }

        const updateData = {}

        if(delivery_status === "Cancelled"){
            updateData.delivery_status = "Cancelled"
            updateData.order_status = "Cancelled"
            updateData.cancel_reason = cancel_reason || "Cancelled by admin"
            updateData.cancelled_by = "ADMIN"
        } else if(delivery_status === "Packed"){
            updateData.delivery_status = "Packed"
            updateData.order_status = "Confirmed"
        } else if(delivery_status === "Out for Delivery"){
            updateData.delivery_status = "Out for Delivery"
            updateData.order_status = "Shipped"
        } else if(delivery_status === "Delivered"){
            updateData.delivery_status = "Delivered"
            updateData.order_status = "Delivered"
        } else {
            updateData.delivery_status = delivery_status
        }

        const result = await OrderModel.updateMany(
            { _id : { $in : orderIds } },
            { $set : updateData }
        )

        return response.json({
            message : "Order status updated successfully",
            data : result,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}

export async function cancelOrderByUserController(request,response){
    try {
        const userId = request.userId
        const { orderId, cancel_reason } = request.body

        if(!cancel_reason){
            return response.status(400).json({
                message : "Please provide a reason for cancellation",
                error : true,
                success : false
            })
        }

        const order = await OrderModel.findOne({ _id : orderId, userId : userId })

        if(!order){
            return response.status(404).json({
                message : "Order not found",
                error : true,
                success : false
            })
        }

        if(order.delivery_status !== "Pending"){
            return response.status(400).json({
                message : "Only pending orders can be cancelled",
                error : true,
                success : false
            })
        }

        order.delivery_status = "Cancelled"
        order.order_status = "Cancelled"
        order.cancel_reason = cancel_reason
        order.cancelled_by = "USER"
        await order.save()

        return response.json({
            message : "Order cancelled successfully",
            data : order,
            error : false,
            success : true
        })
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true,
            success : false
        })
    }
}