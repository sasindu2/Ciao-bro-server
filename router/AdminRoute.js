const express = require('express');

const {createAdmin,getAllAdmin,LoginAdmin} = require("../controller/AdminController");

const router = express.Router();

// Routes
router.get('/', getAllAdmin);
router.post('/', createAdmin);
router.post('/login',LoginAdmin);

module.exports = router;
