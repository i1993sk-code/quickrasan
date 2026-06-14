import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";

// Routes Import
import userRouter from "./routes/user.route.js"; 
import categoryRouter from "./routes/category.route.js"; 
import productRouter from "./routes/product.route.js";
import cartRouter from "./routes/cart.route.js";

dotenv.config();

const app = express(); // Pehle 'app' banana zaroori hai

// --- Middlewares ---
app.use(express.json()); 
app.use(cookieParser());
const allowedOrigins = [
    process.env.FRONTEND_URL || "http://localhost:5173",
    "https://quickrasan.vercel.app",
    "https://www.quickrasan.com",
    "https://quickrasan.com",
    "https://www.quickrasan.in",
    "https://quickrasan.in"
]
app.use(cors({
    credentials: true,
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(null, true) // allow all in dev
        }
    }
}));
app.use(morgan("dev"));
app.use(helmet({
    crossOriginResourcePolicy: false
}));

// --- Routes Setup (Ab yahan 'app' available hai) ---
app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter); 
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);

app.get("/", (req, res) => {
    res.json({ message: "QuickRasan Server is alive!" });
});
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 4500;

// --- Database & Server Start ---
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("❌ Server could not start:", err.message);
});