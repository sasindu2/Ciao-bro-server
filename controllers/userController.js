// const express = require('express');
// const router = express.Router();
// const Food = require('../models/Food');

// // Route to fetch all food items (menu)
// router.get('/menu', async (req, res) => {
//   try {
//     const menu = await Food.find(); // Fetch all food items
//     res.status(200).json(menu);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching menu', error });
//   }
// });

// // Route to select an item (optional to log user selections)
// router.post('/select-item', async (req, res) => {
//   try {
//     const { foodId, quantity } = req.body; // Expect foodId and quantity in request
//     const foodItem = await Food.findById(foodId);

//     if (!foodItem) {
//       return res.status(404).json({ message: 'Food item not found' });
//     }

//     res.status(200).json({
//       message: 'Item selected successfully',
//       foodItem: {
//         id: foodItem._id,
//         name: foodItem.name,
//         quantity: quantity,
//         price: foodItem.price * quantity,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Error selecting item', error });
//   }
// });

// module.exports = router;
