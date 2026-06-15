import sendEmail from "../config/sendEmail.js";
import UserModel from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import jwt from "jsonwebtoken";
import generateAccessToken from "../utils/generateAccessToken.js";
import generateRefreshToken from "../utils/generateRefreshToken.js";
import uploadImageCloudinary from "../utils/uploadImageCloudinary.js";
import forgotPasswordTemplate from "../utils/forgotPasswordTemplate.js";
import generateOtp from "../utils/generateOtp.js";
import https from 'https'

const STARTMESSAGING_API_KEY = process.env.STARTMESSAGING_API_KEY || 'sm_live_dd064509c77c75f7fbc5b5d7c84bc819c06caa07'
const BASE_URL = 'api.startmessaging.com'

const smsRequest = (method, path, body) => {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : ''
    const options = {
      hostname: BASE_URL,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': STARTMESSAGING_API_KEY,
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }
    const req = https.request(options, (res) => {
      let chunks = ''
      res.on('data', (chunk) => (chunks += chunk))
      res.on('end', () => {
        try {
          const parsed = JSON.parse(chunks)
          if (res.statusCode >= 400) {
            reject(new Error(parsed.message || `HTTP ${res.statusCode}`))
          } else {
            resolve(parsed.data)
          }
        } catch {
          reject(new Error(chunks))
        }
      })
    })
    req.on('error', reject)
    if (data) req.write(data)
    req.end()
  })
}

const sendOtp = async (mobile) => {
  try {
    const phoneNumber = mobile.startsWith('+91')
      ? `+91${mobile.replace(/^\+91/, '')}`
      : `+91${mobile}`
    const result = await smsRequest('POST', '/otp/send', { phoneNumber })
    return result
  } catch (error) {
    console.error('[SMS ERROR]', error.message)
    return null
  }
}

const verifyOtp = async (requestId, otpCode) => {
  try {
    const result = await smsRequest('POST', '/otp/verify', { requestId, otpCode })
    return result
  } catch (error) {
    console.error('[OTP VERIFY ERROR]', error.message)
    return { verified: false }
  }
}

// --- 1. Register User ---
export async function registerUserController(req, res) {
    try {
        const { name, email, password, mobile } = req.body;

        if (!name || !email || !password) { 
            return res.status(400).json({
                message: "Kindly fill all details",
                error: true,
                success: false
            });
        }

        const userExist = await UserModel.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                message: "Already registered Email",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        const payload = {
            name,
            email,
            password: hashPassword,
            mobile: mobile || "" 
        };

        const newUser = new UserModel(payload);
        const save = await newUser.save();

        const VerifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${save?._id}`;

        await sendEmail({
            sendTo: email,
            subject: "Verify email from Fullstack",
            html: verifyEmailTemplate(name, VerifyEmailUrl)
        });

        return res.json({
            message: "User registered successfully",
            error: false,
            success: true,
            data: save
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 2. Verify Email ---
export async function verifyEmailController(req, res) {
    try {
        const { code } = req.body;
        const user = await UserModel.findById(code);

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired verification link",
                error: true,
                success: false
            });
        }

        await UserModel.findByIdAndUpdate(code, {
            verify_email: true
        });

        return res.json({
            message: "Email verified successfully!",
            error: false,
            success: true
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 3. Login User ---
export async function loginController(request, response) {
    try {
        const { email, password } = request.body;

        if (!email || !password) {
            return response.status(400).json({
                message: "Provide email and password",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "User not registered",
                error: true,
                success: false
            });
        }

        if (user.status !== "Active") {
            return response.status(400).json({
                message: "Account inactive, contact admin",
                error: true,
                success: false
            });
        }

        if (!user.verify_email) {
            return response.status(400).json({
                message: "Please verify your email first",
                error: true,
                success: false
            });
        }

        const checkPassword = await bcryptjs.compare(password, user.password);

        if (!checkPassword) {
            return response.status(400).json({
                message: "Check your password",
                error: true,
                success: false
            });
        }

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.cookie("accessToken", accessToken, cookieOption);
        response.cookie("refreshToken", refreshToken, cookieOption);

        return response.status(200).json({
            message: "Login successfully",
            error: false,
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 4. Logout Controller ---
export async function logoutController(request, response) {
    try {
        const cookiesOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.clearCookie("accessToken", cookiesOption);
        response.clearCookie("refreshToken", cookiesOption);

        return response.json({
            message: "Logout successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 5. User Details Controller (MUST BE HERE) ---
export async function userDetailsController(request, response) {
    try {
        const userId = request.userId; 
        const user = await UserModel.findById(userId).select("-password");

        return response.json({
            message: "user details",
            data: user,
            error: false,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 6. Upload User Avatar ---
export async function uploadAvatar(request, response) {
    try {
        const userId = request.userId;
        const image = request.file; 
        const upload = await uploadImageCloudinary(image);
        
        const updateUser = await UserModel.findByIdAndUpdate(userId, {
            avatar: upload.url
        });

        return response.json({
            message: "upload profile",
            data: {
                _id: request.userId,
                avatar: upload.url
            }
        });
        
    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 7. Update User Details ---
export async function updateUserDetails(request, response) {
    try {
        const userId = request.userId;
        const { name, email, mobile, password } = request.body;

        let hashPassword = "";
        if (password) {
            const salt = await bcryptjs.genSalt(10);
            hashPassword = await bcryptjs.hash(password, salt);
        }

        const updateUser = await UserModel.findByIdAndUpdate(
            userId, 
            {
                ...(name && { name }),
                ...(email && { email }),
                ...(mobile && { mobile }),
                ...(password && { password: hashPassword })
            }, 
            { new: true }
        );

        return response.json({
            message: "User updated successfully",
            error: false,
            success: true,
            data: updateUser
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 8. Send Login OTP (Mobile OTP Login) ---
export async function sendLoginOtpController(request, response) {
    try {
        const { mobile } = request.body;

        if (!mobile || mobile.length !== 10) {
            return response.status(400).json({
                message: "Provide a valid 10-digit mobile number",
                error: true,
                success: false
            });
        }

        let user = await UserModel.findOne({ mobile });

        if (!user) {
            const genName = "User" + mobile.slice(-4);
            const genEmail = mobile + "@qr.guest";
            const dummyPassword = await bcryptjs.hash(mobile + process.env.SECRET_KEY_ACCESS_TOKEN, 10);

            user = await UserModel.create({
                name: genName,
                email: genEmail,
                mobile: mobile,
                password: dummyPassword,
                verify_email: true
            });
        }

        const result = await sendOtp(mobile);

        if (!result || !result.requestId) {
            const devOtp = mobile === "9999999999" ? "000000" : generateOtp();
            const expiry = new Date(Date.now() + 5 * 60 * 1000);
            await UserModel.findByIdAndUpdate(user._id, {
                forgot_password_otp: String(devOtp),
                forgot_password_expiry: expiry
            });
            console.log(`📱 Dev OTP for ${mobile}: ${devOtp}`);
            return response.json({
                message: "OTP sent to your mobile",
                error: false,
                success: true,
                data: { devOtp }
            });
        }

        await UserModel.findByIdAndUpdate(user._id, {
            login_otp: result.requestId,
            login_otp_expiry: result.expiresAt
        });

        return response.json({
            message: "OTP sent to your mobile",
            error: false,
            success: true,
            data: { requestId: result.requestId }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 9. Verify Login OTP ---
export async function verifyLoginOtpController(request, response) {
    try {
        const { mobile, otp } = request.body;

        if (!mobile || !otp) {
            return response.status(400).json({
                message: "Provide mobile and otp",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ mobile });

        if (!user) {
            return response.status(400).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        if (user.forgot_password_otp) {
            if (user.forgot_password_expiry && new Date() > new Date(user.forgot_password_expiry)) {
                return response.status(400).json({
                    message: "OTP has expired",
                    error: true, success: false
                });
            }
            if (String(user.forgot_password_otp) !== String(otp)) {
                return response.status(400).json({
                    message: "Invalid OTP",
                    error: true, success: false
                });
            }
            user.forgot_password_otp = null;
            user.forgot_password_expiry = null;
        } else {
            if (!user.login_otp) {
                return response.status(400).json({
                    message: "No OTP requested. Please request OTP first.",
                    error: true, success: false
                });
            }
            if (user.login_otp_expiry && new Date() > new Date(user.login_otp_expiry)) {
                return response.status(400).json({
                    message: "OTP has expired",
                    error: true, success: false
                });
            }
            const result = await verifyOtp(user.login_otp, otp);
            if (!result || !result.verified) {
                return response.status(400).json({
                    message: "Invalid OTP",
                    error: true, success: false
                });
            }
            user.login_otp = null;
            user.login_otp_expiry = null;
        }

        user.last_login_date = new Date();
        await user.save();

        const accessToken = await generateAccessToken(user._id);
        const refreshToken = await generateRefreshToken(user._id);

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.cookie("accessToken", accessToken, cookieOption);
        response.cookie("refreshToken", refreshToken, cookieOption);

        return response.json({
            message: "Login successful",
            error: false,
            success: true,
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                accessToken,
                refreshToken
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 10. Forgot Password Controller ---
export async function forgotPasswordController(request, response) {
    try {
        const { email } = request.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        const otp = Math.floor(1000 + Math.random() * 9000); 
        const expireTime = new Date(Date.now() + 60 * 60 * 1000); 

        await UserModel.findByIdAndUpdate(user._id, {
            forgot_password_otp: otp,
            forgot_password_expiry: expireTime.toISOString()
        });

        await sendEmail({
            sendTo: email,
            subject: "QuickRasan - Password Reset OTP",
            html: forgotPasswordTemplate({
                name: user.name,
                otp: otp
            })
        });

        return response.json({
            message: "Check your email for OTP",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 11. Verify Forgot Password OTP ---
export async function verifyForgotPasswordOtp(request, response) {
    try {
        const { email, otp } = request.body;

        if (!email || !otp) {
            return response.status(400).json({
                message: "Provide required field email, otp",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email not available",
                error: true,
                success: false
            });
        }

        const currentTime = new Date().toISOString(); 

        if (user.forgot_password_expiry < currentTime) {
            return response.status(400).json({
                message: "OTP has expired",
                error: true,
                success: false
            });
        }

        if (otp !== user.forgot_password_otp) {
            return response.status(400).json({
                message: "Invalid OTP",
                error: true,
                success: false
            });
        }

        return response.json({
            message: "OTP verified successfully",
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 12. Reset Password ---
export async function resetPassword(request, response) {
    try {
        const { email, newPassword, confirmPassword } = request.body;

        if (!email || !newPassword || !confirmPassword) {
            return response.status(400).json({
                message: "Provide required fields: email, newPassword, confirmPassword",
                error: true,
                success: false
            });
        }

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "Email is not available",
                error: true,
                success: false
            });
        }

        if (newPassword !== confirmPassword) {
            return response.status(400).json({
                message: "New password and confirm password are not the same",
                error: true,
                success: false
            });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(newPassword, salt);

        await UserModel.findByIdAndUpdate(user._id, {
            password: hashPassword,
            forgot_password_otp: "", 
            forgot_password_expiry: "" 
        });

        return response.json({
            message: "Password updated successfully",
            error: false, 
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}

// --- 13. Refresh Token ---
export async function refreshToken(request, response) {
    try {
        const refreshToken = request.cookies?.refreshToken || request?.headers?.authorization?.split(" ")[1];

        if (!refreshToken) {
            return response.status(401).json({
                message: "Invalid token",
                error: true,
                success: false
            });
        }

        const verifyToken = await jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);

        if (!verifyToken) {
            return response.status(401).json({
                message: "Token is expired",
                success: false,
                error: true
            });
        }

        const userId = verifyToken._id || verifyToken.id;
        const newAccessToken = await generateAccessToken(userId);

        const cookieOption = {
            httpOnly: true,
            secure: true,
            sameSite: "None"
        };

        response.cookie("accessToken", newAccessToken, cookieOption);

        return response.json({
            message: "Token refreshed successfully",
            error: false,
            success: true,
            data: {
                accessToken: newAccessToken
            }
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        });
    }
}