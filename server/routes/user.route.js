import { Router } from "express";
import { 
    registerUserController, 
    verifyEmailController, 
    loginController, 
    logoutController, 
    uploadAvatar,
    updateUserDetails,
    forgotPasswordController,
    verifyForgotPasswordOtp,
    resetPassword,
    refreshToken,
    userDetailsController,
    sendLoginOtpController,
    verifyLoginOtpController
} from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";

const userRouter = Router();

// --- Authentication Routes ---
userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginController);
userRouter.get("/logout", auth, logoutController);
userRouter.post("/refresh-token", refreshToken); 

// --- Mobile OTP Login Routes ---
userRouter.post("/send-login-otp", sendLoginOtpController);
userRouter.post("/verify-login-otp", verifyLoginOtpController);

// --- Password Management Routes ---
userRouter.put("/forgot-password", forgotPasswordController);
userRouter.put("/verify-forgot-password-otp", verifyForgotPasswordOtp);
userRouter.put("/reset-password", resetPassword);

// --- User Profile & Details Routes ---
userRouter.get("/user-details", auth, userDetailsController); // <--- Ab ye 404 error nahi dega!
userRouter.put("/upload-avatar", auth, upload.single('avatar'), uploadAvatar);
userRouter.put("/update-user", auth, updateUserDetails);

export default userRouter;