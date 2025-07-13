const express = require("express");
const cors = require("cors");
const http = require("http");
// const path = require("path");
require("dotenv").config();

const connectDb = require("./Config/db");
const documentRoutes = require("./routes/documentRoutes");
const authRoutes = require("./routes/authRoutes");
const initSocket = require("./Socket/socket");

const app = express();

// ✅ Create HTTP server (for socket support)
const server = http.createServer(app);

// ✅ Connect to MongoDB
connectDb();

// ✅ JSON parsing
app.use(express.json());

// ✅ Setup CORS for Render + local dev
const allowedOrigins = [
  "https://my-docs-project-25.onrender.com", // frontend
  "http://localhost:5173",                   // local dev
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

// ✅ API routes (IMPORTANT: placed before static files)
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);

// ✅ Serve frontend (Vite build output)
// app.use(express.static(path.join(__dirname, "client", "dist")));

// // ✅ Handle SPA routes (React Router support)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });

// // ✅ Health check (optional)
// app.get("/health", (req, res) => {
//   res.send("✅ Google Docs Clone Backend is running!");
// });

// ✅ Init WebSocket
initSocket(server);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
