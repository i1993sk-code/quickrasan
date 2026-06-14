const verifyEmailTemplate = (name, url) => {
    return `
        <div style="background-color: #f4f7f6; padding: 40px 10px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <div style="background: linear-gradient(135deg, #007bff 0%, #00c6ff 100%); padding: 30px; text-align: center;">
                    <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Welcome to Fullstack!</h1>
                </div>

                <div style="padding: 40px; text-align: center; color: #444;">
                    <h2 style="margin-top: 0; color: #333;">Hi ${name},</h2>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                        We're excited to have you on board! To get started and secure your account, please verify your email address by clicking the button below.
                    </p>
                    
                    <a href="${url}" style="display: inline-block; padding: 15px 35px; background: #007bff; color: #ffffff; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(0,123,255,0.3); transition: transform 0.2s;">
                        Verify Account Now
                    </a>

                    <p style="margin-top: 35px; font-size: 14px; color: #888;">
                        If you didn't create an account, you can safely ignore this email.
                    </p>
                </div>

                <div style="background: #f9f9f9; padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
                    <p style="margin: 0; font-size: 12px; color: #aaa;">
                        © 2026 Fullstack E-commerce. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    `;
};

export default verifyEmailTemplate;