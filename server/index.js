const express = require("express");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const connectDb = require("./Config/db");
const documentRoutes = require("./routes/documentRoutes");
const authRoutes = require("./routes/authRoutes");
const initSocket = require("./Socket/socket");
const sendShareEmail = require('./utils/mailer');

const app = express();
const server = http.createServer(app);



// ✅ Connect to DB
connectDb();

// ✅ Middleware
app.use(express.json());

// ✅ CORS Fix: No trailing slash in origins
const allowedOrigins = [
  "https://my-docs-project-2001.vercel.app",
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

// ✅ API Routes — Must come BEFORE frontend
app.use("/api/auth", authRoutes);
app.use("/api/docs", documentRoutes);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("✅ Google Docs Backend running!");
});

// ✅ Init WebSocket
initSocket(server);

// ✅ Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
