const express = require('express');

const {createAdmin,getAllAdmin,LoginAdmin} = require("../controller/AdminController");
const jwtMiddleware = require("../middlware/adminloginchecker");
const router = express.Router();

// Routes
router.get('/',jwtMiddleware, getAllAdmin);
router.post('/', createAdmin);
router.post('/login',LoginAdmin);

module.exports = router;
