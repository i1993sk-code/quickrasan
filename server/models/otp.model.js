import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    mobile: { type: String, index: true, sparse: true },
    email: { type: String, index: true, sparse: true },
    otp: { type: String, required: true },
    expiry: { type: Date, required: true }
}, { timestamps: true });

otpSchema.index({ expiry: 1 }, { expireAfterSeconds: 660 });

const OtpModel = mongoose.model("Otp", otpSchema);
export default OtpModel;
