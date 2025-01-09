const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDb = require("./config/db");

const AdminRoute = require("./router/AdminRoute");
const CategoryRoute = require("./router/CategoryRoute");
const FoodRoute = require("./router/FoodRoute");
const OrderRoute = require("./router/OrderRoute");

const http = require("http"); // Correct usage here
const { Server } = require("socket.io");

dotenv.config();
connectDb();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  const io = app.get("socketio");
  io.emit("test-event", { message: "New order created" });
  return res.status(200).send("<h1>Server is running...</h1>");
});

// Port
const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app); // Correct HTTP server setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Attach Socket.IO to the app
app.set("socketio", io);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Example: Emit new order event
  io.emit("newOrder", { message: "New order created" });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Routes
app.use("/api/Admin", AdminRoute);
app.use("/api/Category", CategoryRoute);
app.use("/api/Food", FoodRoute);
app.use("/api/Order", OrderRoute);

module.exports = io;
