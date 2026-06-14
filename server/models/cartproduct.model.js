import mongoose from "mongoose";

const cartProductSchmea = new mongoose.Schema({
    productId:{
        type:mongoose.Schema.ObjectId,
        ref:"product"
    },

    quantity:{
        type:Number,
        default:1
    },

    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User"
    },

},{
    timestamps:true
})

const CartProductModel= mongoose.model("cartproduct",cartProductSchmea)

export default CartProductModel