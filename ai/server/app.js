require("dotenv").config();

console.log("================================");
console.log("================================");

const express = require("express");
const cors = require("cors");

const supabase = require("./database/supabase");
const chatRoutes = require("./routes/chat");
const inquiryRoutes = require("./routes/inquiry");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/chat", chatRoutes);
app.use("/inquiry", inquiryRoutes);

const PORT = process.env.PORT || 3000;

// Home Route
app.get("/", (req, res) => {
    res.send("🚀 Ask Aarya AI Backend is Running!");
});

// Test Supabase Connection
app.get("/test-db", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("leads")
            .select("*");

        if (error) {
            return res.status(500).json(error);
        }

        res.json(data);
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});