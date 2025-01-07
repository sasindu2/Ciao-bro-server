const express = require('express');

const { getallOrder,createOrder,orderstatuschange} = require("../controller/OrderController");

const router = express.Router();

// Routes
router.get('/', getallOrder);
router.post('/', createOrder);
router.patch('/:id', orderstatuschange);
router.delete('/:id', orderstatuschange);



module.exports = router;
