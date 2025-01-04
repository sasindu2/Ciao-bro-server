// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, adminProtect } = require('../middlewares/authMiddleware');

// Apply both middleware 
router.use(protect);      // First verify the token
router.use(adminProtect); // Then check if user is admin

// Food management routes
router.get('/foods', adminController.getAllFoods);
router.post('/foods', adminController.addFood);
router.put('/foods/:id', adminController.updateFood);
router.delete('/foods/:id', adminController.deleteFood);

// Category management routes
router.post('/categories', adminController.addCategory); 
router.delete('/categories/:id', adminController.deleteCategory);


module.exports = router;