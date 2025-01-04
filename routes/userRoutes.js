const express = require('express');
const router = express.Router();
const Food = require('../models/Food'); // Import the Food model

/**
 * Route: GET /api/user/menu
 * Description: Fetch all available food items (menu)
 * Public: No authentication required
 */
router.get('/menu', async (req, res) => {
  try {
    const menu = await Food.find(); // Retrieve all food items from the database
    res.status(200).json(menu); // Send the menu data as a JSON response
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu', error });
  }
});

/**
 * Route: POST /api/user/select-item
 * Description: Select a specific food item and its quantity
 * Public: No authentication required
 */
router.post('/select-item', async (req, res) => {
  try {
    const { foodId, quantity } = req.body; // Expect foodId and quantity in request body

    // Validate input
    if (!foodId || !quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid food ID or quantity' });
    }

    // Fetch the food item from the database
    const foodItem = await Food.findById(foodId);

    // If food item doesn't exist, return error
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    // Respond with the selected item details
    res.status(200).json({
      message: 'Item selected successfully',
      foodItem: {
        id: foodItem._id,
        name: foodItem.name,
        quantity: quantity,
        price: foodItem.price * quantity, // Total price based on quantity
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error selecting item', error });
  }
});

module.exports = router;
