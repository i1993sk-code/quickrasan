import jwt from "jsonwebtoken";

const generateAccessToken = async (userId) => {
    // 1. Token generate karein
    const token = await jwt.sign(
        { id: userId }, 
        process.env.SECRET_KEY_ACCESS_TOKEN, 
        { expiresIn: '5h' }
    );

    return token;
}

// Export karte waqt naam same hona chahiye
export default generateAccessToken;