const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();
const path = require("path");

const connectDb = require("./Config/db");
const documentRoutes = require("./routes/documentRoutes");
const authRoutes = require("./routes/authRoutes");
const initSocket = require("./Socket/socket");
const sendShareEmail = require('./utils/mailer');

const app = express();
const server = http.createServer(app);

// ✅ Connect to MongoDB
connectDb();

// ✅ Middleware
app.use(express.json());

// ✅ CORS setup
const allowedOrigins = [
  "https://my-docs-project-25.onrender.com",
  "http://localhost:5173"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

// ✅ API Routes (Put these BEFORE static serving)
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);

// ✅ Serve frontend from Vite (React)
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// ✅ All client-side routes go to index.html (React SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// ✅ WebSocket
initSocket(server);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
