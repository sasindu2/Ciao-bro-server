// Import necessary modules
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const http = require("http");
const { Server } = require("socket.io");
const connectDb = require("./config/db");

// Import custom routes
const AdminRoute = require("./router/AdminRoute");
const CategoryRoute = require("./router/CategoryRoute");
const FoodRoute = require("./router/FoodRoute");
const OrderRoute = require("./router/OrderRoute");

// Load environment variables
dotenv.config();

// Connect to the database
connectDb();

// Initialize Express application
const app = express();

// Apply middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Define a test route
app.get("/", (req, res) => {
  const io = app.get("socketio");
  io.emit("test-event", { message: "New order created" });
  res.status(200).send("<h1>Server is running...</h1>");
});

// Define API routes
app.use("/api/Admin", AdminRoute);
app.use("/api/Category", CategoryRoute);
app.use("/api/Food", FoodRoute);
app.use("/api/Order", OrderRoute);

// Set the port
const PORT = process.env.PORT || 5000;

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO with CORS configuration
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Attach Socket.IO instance to the app for later use
app.set("socketio", io);

// Handle Socket.IO connections
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Emit a test event upon new connection
  io.emit("newOrder", { message: "New order created" });

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Export the Socket.IO instance for use in other modules if needed
module.exports = io;
