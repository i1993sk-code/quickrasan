import PartnerModel from "../models/partner.model.js";
import sendEmail from "../config/sendEmail.js";

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

export const updatePartnerStatusController = async (req, res) => {
  try {
    const { partnerId, status } = req.body;
    if (!partnerId || !["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid request. Provide partnerId and status (Approved/Rejected)", error: true, success: false });
    }
    const partner = await PartnerModel.findByIdAndUpdate(partnerId, { status }, { new: true });
    if (!partner) {
      return res.status(404).json({ message: "Partner not found", error: true, success: false });
    }

    if (status === "Approved" && partner.email) {
      const html = `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px">
          <div style="background:#1B5E20;padding:20px;border-radius:12px 12px 0 0;text-align:center">
            <h1 style="color:#FF8F00;margin:0;font-size:24px">QuickRasan</h1>
            <p style="color:white;margin:4px 0 0;font-size:13px">Partner Program</p>
          </div>
          <div style="background:#f9f9f9;padding:24px;border-radius:0 0 12px 12px">
            <h2 style="color:#1B5E20;margin:0 0 12px">Welcome to QuickRasan, ${partner.ownerName}! 🎉</h2>
            <p style="color:#333;line-height:1.6">Dear <strong>${partner.ownerName}</strong>,</p>
            <p style="color:#333;line-height:1.6">We are excited to inform you that your partnership application with <strong>QuickRasan</strong> has been <strong style="color:#1B5E20">approved</strong>!</p>
            <div style="background:white;border-radius:8px;padding:16px;margin:16px 0">
              <h3 style="color:#1B5E20;margin:0 0 8px;font-size:14px">Your Shop Details</h3>
              <table style="width:100%;font-size:13px;color:#555">
                <tr><td style="padding:4px 0"><strong>Shop Name:</strong></td><td>${partner.shopName}</td></tr>
                <tr><td style="padding:4px 0"><strong>Owner:</strong></td><td>${partner.ownerName}</td></tr>
                <tr><td style="padding:4px 0"><strong>Mobile:</strong></td><td>${partner.mobile}</td></tr>
                <tr><td style="padding:4px 0"><strong>Address:</strong></td><td>${partner.address}, ${partner.city}, ${partner.district}, ${partner.state} - ${partner.pincode}</td></tr>
              </table>
            </div>
            <p style="color:#333;line-height:1.6">Our team will reach out to you shortly to help you set up your online storefront. You can start listing your products and receiving orders from customers in your area.</p>
            <p style="color:#333;line-height:1.6">If you have any questions, feel free to contact us on WhatsApp: <a href="https://wa.me/919608354372" style="color:#1B5E20;font-weight:bold">+91 9608354372</a></p>
            <div style="text-align:center;margin-top:20px">
              <a href="https://quickrasan.com" style="background:#1B5E20;color:white;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">Visit QuickRasan</a>
            </div>
            <hr style="border:none;border-top:1px solid #ddd;margin:20px 0" />
            <p style="color:#999;font-size:11px;text-align:center">QuickRasan — India's fastest grocery delivery</p>
          </div>
        </div>
      `;
      await sendEmail({
        sendTo: partner.email,
        subject: "Welcome to QuickRasan — Your Partnership is Approved! 🎉",
        html,
      });
    }

    return res.json({ message: "Partner status updated", data: partner, success: true, error: false });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true, success: false });
  }
};
