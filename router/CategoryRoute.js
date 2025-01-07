const express = require('express');

const { getAllCategory,createCategory,updatecategory,deletecategory } = require("../controller/CategoryController");
const jwtMiddleware = require("../middlware/adminloginchecker");

const router = express.Router();

// Routes
router.get('/', getAllCategory);
router.post('/',jwtMiddleware, createCategory);
router.patch('/:id',jwtMiddleware, updatecategory);
router.delete('/:id',jwtMiddleware, deletecategory);


module.exports = router;
