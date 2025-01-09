const express = require('express');

const { getAllFood, createFood, updateFood ,deleteFood,categorygetfood,Availablity,getavalinbality  } = require("../controller/FoodController");
const jwtMiddleware = require("../middlware/adminloginchecker");

const router = express.Router();

// Routes
router.get('/', getAllFood);
router.get('/availablity', getavalinbality);
router.post('/',jwtMiddleware, createFood);
router.patch('/:id',jwtMiddleware, updateFood);
router.delete('/:id',jwtMiddleware, deleteFood);
router.get('/:id', categorygetfood);
router.get('/availablity/:id',jwtMiddleware, Availablity);


module.exports = router;
