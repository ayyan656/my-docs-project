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

// ✅ Create HTTP server
const server = http.createServer(app);

// ✅ Connect to MongoDB
connectDb();

// ✅ Middleware to parse JSON
app.use(express.json());



// ✅ Fixed CORS setup for Render + local dev
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

app.use(express.static(path.join(__dirname, 'client', 'dist')));

// All other GET requests not handled before will return React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);

// ✅ Health Check
app.get("/", (req, res) => {
  res.send("✅ Google Docs Clone Backend is running!");
});

// ✅ Initialize Socket.io
initSocket(server);

// ✅ Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
