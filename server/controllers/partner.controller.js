import PartnerModel from "../models/partner.model.js";

export const createPartnerController = async (req, res) => {
  try {
    const { shopName, ownerName, mobile, email, state, district, city, address, pincode, categories } = req.body;
    if (!shopName || !ownerName || !mobile) {
      return res.status(400).json({ message: "Shop name, owner name, and mobile are required", error: true, success: false });
    }
    const partner = await PartnerModel.create({ shopName, ownerName, mobile, email, state, district, city, address, pincode, categories });
    return res.json({ message: "Application submitted successfully", data: partner, success: true, error: false });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true, success: false });
  }
};

export const getPartnersController = async (req, res) => {
  try {
    const data = await PartnerModel.find().sort({ createdAt: -1 });
    return res.json({ data, success: true, error: false });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true, success: false });
  }
};
