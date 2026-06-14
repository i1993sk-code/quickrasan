const forgotPasswordTemplate = ({ name, otp }) => {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background-color:#f2f7f2;font-family:'Inter',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f2f7f2;padding:40px 16px;">
    <tr>
      <td align="center">
        <table width="440" cellpadding="0" cellspacing="0" style="max-width:440px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 8px 32px rgba(27,94,32,0.10);">

          <!-- Brand Bar -->
          <tr>
            <td style="background:linear-gradient(135deg,#1B5E20 0%,#2E7D32 100%);padding:28px 24px;text-align:center;">
              <div style="font-size:28px;font-weight:900;color:#FF8F00;letter-spacing:-0.5px;">Quick<span style="color:#ffffff;">Rasan</span></div>
              <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px;font-weight:500;">Password Reset Verification</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;text-align:center;">
              <!-- Lock Icon -->
              <div style="width:56px;height:56px;background:#E8F5E9;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:20px;">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1B5E20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/>
                </svg>
              </div>

              <h2 style="margin:0 0 4px;font-size:20px;font-weight:800;color:#1a1a2e;">Reset Your Password</h2>
              <p style="margin:0 0 24px;font-size:14px;color:#6b7280;line-height:1.5;">
                Hello <strong style="color:#1B5E20;">${name}</strong>,<br>
                Enter the 4-digit code below to proceed.
              </p>

              <!-- OTP Box -->
              <div style="background:linear-gradient(135deg,#E8F5E9,#C8E6C9);border-radius:12px;padding:20px 24px;display:inline-block;border:1px solid #a5d6a7;">
                <span style="font-size:42px;font-weight:800;color:#1B5E20;letter-spacing:10px;font-family:monospace;">${otp}</span>
              </div>

              <p style="margin:20px 0 0;font-size:12px;color:#9ca3af;line-height:1.5;">
                ⏱ Valid for 60 minutes &bull; Never share this code
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr><td style="height:1px;background:linear-gradient(to right,transparent,#e5e7eb,transparent);"></td></tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#fafcfa;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#1B5E20;">🇮🇳 QuickRasan</p>
              <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">
                Jharkhand ki Sabse Fast Grocery Delivery<br>
                Didn't request this? Please ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;
};

export default forgotPasswordTemplate;