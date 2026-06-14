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
import subCategoryRouter from "./routes/subCategory.route.js";
import partnerRouter from "./routes/partner.route.js";

dotenv.config();

const app = express(); // Pehle 'app' banana zaroori hai

// --- Middlewares ---
app.use(express.json()); 
app.use(cookieParser());
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173").split(",").map(s => s.trim());
app.use(cors({
    credentials: true,
    origin: (origin, cb) => {
        if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) return cb(null, true);
        return cb(null, true);
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
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/partner", partnerRouter);

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