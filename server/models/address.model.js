import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    userId : {
        type : mongoose.Schema.ObjectId,
        ref : "User"
    },
    address_line:{
        type:String,
        default:""
    },

    city:{
        type:String,
        default:""
    },

    state:{
        type:String,
        default:""
    },

    pincode:{
        type:String,
        default:""
    },

    country:{
        type:String,
        default:"india"
    },

    mobile:{
        type:Number,
        default:null
    },

    status:{
        type:Boolean,
        default:true
    },


},{
    timestamps:true
})

const AddressModel = mongoose.model("address",addressSchema)

export default AddressModel;