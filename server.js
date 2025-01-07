const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDb = require("./config/db");

const AdminRoute = require("./router/AdminRoute");
const CategoryRoute = require("./router/CategoryRoute");
const FoodRoute = require("./router/FoodRoute");

dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req,res)=>{
    return res.status(200).send("<h1>server was runing..</h1>");
});

const PORT = process.env.PORT;

app.listen(PORT,()=>{
    console.log("Server Running ");
});


// Routes
app.use('/api/Admin', AdminRoute);
app.use('/api/Category', CategoryRoute);
app.use('/api/Food', FoodRoute);

