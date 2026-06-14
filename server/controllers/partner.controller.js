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
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f2f7f2;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f7f2;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(27,94,32,0.10);">

          <tr>
            <td style="background:linear-gradient(135deg,#1B5E20 0%,#2E7D32 100%);padding:32px 24px;text-align:center;">
              <div style="font-size:30px;font-weight:900;color:#FF8F00;letter-spacing:-0.5px;">Quick<span style="color:#ffffff;">Rasan</span></div>
              <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px;font-weight:500;">Partner Program</div>
            </td>
          </tr>

          <tr>
            <td style="padding:36px 32px;">
              <div style="width:56px;height:56px;background:#E8F5E9;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1B5E20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h2 style="margin:0 0 4px;font-size:22px;font-weight:800;color:#1a1a2e;">Welcome Aboard! 🎉</h2>
              <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6;">
                Dear <strong style="color:#1B5E20;">${partner.ownerName}</strong>,<br>
                We are thrilled to welcome you as an official <strong>QuickRasan Partner</strong>!
              </p>

              <div style="background:#f0faf0;border-radius:12px;padding:16px 20px;margin-bottom:20px;border:1px solid #c8e6c9;">
                <h3 style="margin:0 0 10px;font-size:14px;font-weight:700;color:#1B5E20;">📍 Your Shop Details</h3>
                <table style="width:100%;font-size:13px;color:#555;">
                  <tr><td style="padding:4px 0;color:#888;width:90px;">Shop Name</td><td style="padding:4px 0;font-weight:600;color:#1a1a2e;">${partner.shopName}</td></tr>
                  <tr><td style="padding:4px 0;color:#888;">Owner</td><td style="padding:4px 0;font-weight:600;color:#1a1a2e;">${partner.ownerName}</td></tr>
                  <tr><td style="padding:4px 0;color:#888;">Mobile</td><td style="padding:4px 0;font-weight:600;color:#1a1a2e;">${partner.mobile}</td></tr>
                  <tr><td style="padding:4px 0;color:#888;">Address</td><td style="padding:4px 0;font-weight:600;color:#1a1a2e;">${partner.address}, ${partner.city}, ${partner.district}, ${partner.state} - ${partner.pincode}</td></tr>
                </table>
              </div>

              <p style="margin:0 0 6px;font-size:14px;color:#374151;line-height:1.6;">Our team will reach out shortly to help you set up your online storefront and start receiving orders from customers in your area.</p>
              <p style="margin:0 0 20px;font-size:14px;color:#374151;line-height:1.6;">Got questions? Ping us on WhatsApp!</p>

              <div style="text-align:center;">
                <a href="https://wa.me/919608354372" style="background:#25D366;color:white;padding:12px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px;display:inline-block;margin-bottom:10px;">Chat on WhatsApp</a><br>
                <a href="https://quickrasan.com" style="color:#1B5E20;font-size:13px;font-weight:600;text-decoration:none;">Visit QuickRasan →</a>
              </div>
            </td>
          </tr>

          <tr><td style="height:1px;background:linear-gradient(to right,transparent,#e5e7eb,transparent);"></td></tr>

          <tr>
            <td style="padding:20px 32px;background:#fafcfa;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1B5E20;">🇮🇳 QuickRasan</p>
              <p style="margin:0;font-size:11px;color:#9ca3af;">Jharkhand ki Sabse Fast Grocery Delivery</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;
      await sendEmail({
        sendTo: partner.email,
        subject: "🎉 Welcome to QuickRasan — Your Partnership is Approved!",
        html,
      });
    }

    return res.json({ message: "Partner status updated", data: partner, success: true, error: false });
  } catch (err) {
    return res.status(500).json({ message: err.message || err, error: true, success: false });
  }
};
