const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDb = require("./config/db");

const AdminRoute = require("./router/AdminRoute");
const CategoryRoute = require("./router/CategoryRoute");
const FoodRoute = require("./router/FoodRoute");
const OrderRoute = require("./router/OrderRoute");

const { Server } = require("socket.io");
const http = require("http");

dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  io.emit("test-event", { message: "New order created" });
  return res.status(200).send("<h1>Server is running...</h1>");
});

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  //   socket.on("newOrder", (data) => {
  //     console.log("New order received:", data);
  //   });

  //   setInterval(() => {
  //     socket.emit("test-response", { message: "Test response from server!" });
  //   }, 1000);

  io.emit("newOrder", { message: "New order created" });

  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Routes
app.use("/api/Admin", AdminRoute);
app.use("/api/Category", CategoryRoute);
app.use("/api/Food", FoodRoute);
app.use("/api/Order", OrderRoute);

module.exports = io;
