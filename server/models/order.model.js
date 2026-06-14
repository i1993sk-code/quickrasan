import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
     userId:{
         type:mongoose.Schema.ObjectId,
         ref:"User"
     },

     orderId:{
         type:String,
         required:[true,"provide orderId"],
     },

     groupOrderId:{
         type:String,
         default:""
     },

     productId:{
         type:mongoose.Schema.ObjectId,
         default:"product"
     },

     product_details:{
         name:String,
         image:Array,
         price:Number,
         discount:Number,
     },

     quantity:{
         type:Number,
         default:1
     },

     paymentId:{
         type:String,
         default:""
     },

     payment_status:{
         type:String,
         default:""
     },

     order_status:{
         type:String,
         enum:["Pending","Confirmed","Shipped","Delivered","Cancelled"],
         default:"Pending"
     },

     delivery_status:{
         type:String,
         enum:["Pending","Packed","Out for Delivery","Delivered","Cancelled"],
         default:"Pending"
     },

     cancel_reason:{
         type:String,
         default:""
     },

     cancelled_by:{
         type:String,
         enum:["","USER","ADMIN"],
         default:""
     },

     delivery_address:{
         type: mongoose.Schema.ObjectId,
         ref:"address"
     },

     subTotalAmt:{
         type:Number,
         default:0
     },

     totalAmt:{
         type:Number,
         default:0
     },

     invoice_reciept:{
         type:String,
         default:""
     },

},{
    timestamps:true
})

const OrderModel = mongoose.model("order",orderSchema)

export default OrderModel