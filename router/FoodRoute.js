const express = require('express');

const { getAllFood, createFood, updateFood ,deleteFood,categorygetfood  } = require("../controller/FoodController");

const router = express.Router();

// Routes
router.get('/', getAllFood);
router.post('/', createFood);
router.patch('/:id', updateFood);
router.delete('/:id', deleteFood);
router.get('/:id', categorygetfood);


module.exports = router;
