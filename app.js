const dotenv = require("dotenv");
dotenv.config({ override: true });

const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const connectDb = require("./config/dbconfig");
const Patient = require("./models/Patient");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
const app = express();
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

app.use(cors());
app.use(express.json());
app.set("trust proxy", true);

// ===================== NEW =====================
// Home Route
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Telemedicine Backend is running successfully!",
    status: "OK",
  });
});

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    database: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    server: "Running",
  });
});
// ===============================================

// Mount routes
const authRoutes = require("./routes/auth");
const patientRoutes = require("./routes/patient");
const doctorRoutes = require("./routes/doctor");
const consultationRoutes = require("./routes/consultation");
const notificationRoutes = require("./routes/notification");
const adminRoutes = require("./routes/admin");

app.use("/api/auth", authRoutes);
app.use("/api/patient", patientRoutes);
app.use("/api/doctor/notifications", notificationRoutes);
app.use("/api/doctor", doctorRoutes);
app.use("/api/consultation", consultationRoutes);
app.use("/api/admin", adminRoutes);

// Connect Database
connectDb();

// ================= WebRTC Signaling =================
const onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("register", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  socket.on("call-user", ({ to, from, signal, callerName, consultationId }) => {
    const targetSocket = onlineUsers.get(to);

    if (targetSocket) {
      io.to(targetSocket).emit("incoming-call", {
        from,
        signal,
        callerName,
        consultationId,
      });
    } else {
      socket.emit("user-offline", { userId: to });
    }
  });

  socket.on("answer-call", ({ to, signal }) => {
    const targetSocket = onlineUsers.get(to);

    if (targetSocket) {
      io.to(targetSocket).emit("call-accepted", { signal });
    }
  });

  socket.on("end-call", ({ to }) => {
    const targetSocket = onlineUsers.get(to);

    if (targetSocket) {
      io.to(targetSocket).emit("call-ended");
    }
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    const targetSocket = onlineUsers.get(to);

    if (targetSocket) {
      io.to(targetSocket).emit("ice-candidate", { candidate });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

server.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});