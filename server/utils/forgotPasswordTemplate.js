const forgotPasswordTemplate = ({ name, otp }) => {
    return `
        <div style="background-color: #f3f4f6; padding: 30px 15px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
            <div style="max-width: 400px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e5e7eb; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
                
                <div style="background: #2563eb; padding: 20px; text-align: center; border-radius: 12px 12px 0 0;">
                    <h2 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">Verification Code</h2>
                </div>

                <div style="padding: 30px; text-align: center;">
                    <p style="margin: 0; color: #374151; font-size: 16px;">Hello <strong>${name}</strong>,</p>
                    <p style="margin: 10px 0 25px; color: #6b7280; font-size: 14px;">Use the code below to reset your password.</p>
                    
                    <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 15px; display: inline-block; min-width: 200px;">
                        <span style="font-size: 32px; font-weight: 700; color: #1e40af; letter-spacing: 6px;">
                            ${otp}
                        </span>
                    </div>

                    <p style="margin-top: 25px; font-size: 12px; color: #9ca3af;">
                        Expires in 60 minutes. <br>
                        If you didn't request this, please ignore.
                    </p>
                </div>

                <div style="padding: 15px; background: #f9fafb; text-align: center; border-top: 1px solid #f3f4f6; border-radius: 0 0 12px 12px;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af; font-weight: 500;">
                        Securely sent by Fullstack Team
                    </p>
                </div>
            </div>
        </div>
    `;
};

export default forgotPasswordTemplate;