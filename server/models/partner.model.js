import mongoose from "mongoose";

const partnerSchema = new mongoose.Schema({
  shopName: { type: String, required: true },
  ownerName: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String, default: "" },
  state: { type: String, default: "" },
  district: { type: String, default: "" },
  city: { type: String, default: "" },
  address: { type: String, default: "" },
  pincode: { type: String, default: "" },
  categories: [{ type: String }],
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
}, { timestamps: true });

const PartnerModel = mongoose.model("partner", partnerSchema);
export default PartnerModel;
