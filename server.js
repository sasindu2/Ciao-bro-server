const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req,res)=>{
    return res.status(200).send("<h1>Welcome to server</h1>");
});

const PORT = 8080;

app.listen(PORT,()=>{
    console.log("Server Running ");
});