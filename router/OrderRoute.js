const express = require('express');

const { getallOrder,createOrder,orderstatuschange,deleteorder} = require("../controller/OrderController");
const jwtMiddleware = require("../middlware/adminloginchecker");

const router = express.Router();

// Routes
router.get('/',jwtMiddleware, getallOrder);
router.post('/',createOrder);
router.patch('/:id',jwtMiddleware, orderstatuschange);
router.delete('/:id',jwtMiddleware, deleteorder);



module.exports = router;
