const Admin = require("../model/Admin");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");

// Get all Admin
const getAllAdmin = async (req, res) => {
  try {
    const users = await Admin.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

// Create a Admin
const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const newAdmin = new Admin({ name, email, password:encryptedPassword });
    const savedAdmin = await newAdmin.save();
    res.status(201).json(savedAdmin);
  } catch (error) {
    res.status(500).json({ message: "Error creating Admin", error });
  }
};


//login admin
const LoginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const findAdmin = await Admin.findOne({ email });
    if (!findAdmin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, findAdmin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: findAdmin._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: findAdmin._id,
        name: findAdmin.name,
        email: findAdmin.email,
      },
    });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error login Admin", error });
  }
};

module.exports = { getAllAdmin, createAdmin ,LoginAdmin };
