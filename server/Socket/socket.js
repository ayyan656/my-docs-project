const { Server } = require("socket.io");

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [
        "https://my-docs-project-2972.vercel.app",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000, // Optional: Helps keep connections alive
  });

  io.on("connection", (socket) => {
    console.log("🟢 Client connected:", socket.id);

    // Join a document room
    socket.on("join-document", (documentId) => {
      if (documentId) {
        socket.join(documentId);
        console.log(`📄 Socket ${socket.id} joined document room: ${documentId}`);
      }
    });

    // Broadcast content changes to others in the room
    socket.on("send-changes", ({ documentId, delta }) => {
      if (documentId && delta) {
        socket.to(documentId).emit("receive-changes", delta);
        console.log(`✏️ Sent changes for document: ${documentId}`);
      }
    });

    // Handle disconnect
    socket.on("disconnect", (reason) => {
      console.log(`🔴 Disconnected: ${socket.id} (${reason})`);
    });

    // Error handling
    socket.on("error", (err) => {
      console.error("❌ Socket error:", err);
    });
  });
};

module.exports = initSocket;
