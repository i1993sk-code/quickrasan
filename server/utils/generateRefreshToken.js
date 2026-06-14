import jwt from "jsonwebtoken"; // Ye zaroori hai
import UserModel from "../models/user.model.js";

const generateRefreshToken = async (userId) => {
    // 1. Refresh Token generate karein (30 din ke liye)
    const token = await jwt.sign(
        { id: userId }, 
        process.env.SECRET_KEY_REFRESH_TOKEN, // Alag key use karna behtar hai
        { expiresIn: '30d' }
    );

    // 2. Database mein user ka refresh_token update karein
    await UserModel.updateOne(
        { _id: userId },
        {
            refresh_token: token
        }
    );

    return token;
};

export default generateRefreshToken;