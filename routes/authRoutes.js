const express = require('express');
const { registerUser, loginUser, registerAdmin, loginAdmin } = require('../controllers/authController');
const router = express.Router();

// Routes
router.post('/register', registerUser); // User registration
router.post('/login', loginUser); // User login
router.post('/admin/register', registerAdmin); // Admin registration
router.post('/admin/login', loginAdmin); // Admin login


module.exports = router;
