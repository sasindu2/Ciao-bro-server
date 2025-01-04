// controllers/adminController.js
const Food = require('../models/Food');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: './public/uploads/foods',
  filename: function(req, file, cb) {
    cb(null, 'food-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB limit
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single('image');

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

const adminController = {
  // Get all foods
  getAllFoods: async (req, res) => {
    try {
      // Verify the admin is making the request
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }

      const foods = await Food.find().populate('category');
      res.status(200).json(foods);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Add new food
  addFood: async (req, res) => {
    console.log('req.user:', req.user); // Debug log
  
    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
  
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }
  
      if (!req.file) {
        return res.status(400).json({ message: 'Please upload an image' });
      }
  
      try {
        const { name, categoryId, price, description } = req.body;
  
        const category = await Category.findById(categoryId);
        if (!category) {
          return res.status(404).json({ message: 'Category not found' });
        }
  
        const newFood = new Food({
          name,
          category: categoryId,
          price,
          description,
          image: `/uploads/foods/${req.file.filename}`,
          addedBy: req.user._id,
        });
  
        const savedFood = await newFood.save();
        res.status(201).json(savedFood);
      } catch (error) {
        console.error('Error Adding Food:', error.message); // Debug log
        res.status(500).json({ message: error.message });
      }
    });
  
  
  },


  // Update food
  updateFood: async (req, res) => {
    // Verify the admin is making the request
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }

      try {
        const foodId = req.params.id;
        const updates = req.body;
        
        if (req.file) {
          updates.image = `/uploads/foods/${req.file.filename}`;
        }

        const food = await Food.findByIdAndUpdate(
          foodId,
          { ...updates, lastModifiedBy: req.user._id },  // Track which admin modified the food
          { new: true }
        );

        if (!food) {
          return res.status(404).json({ message: 'Food not found' });
        }

        res.status(200).json(food);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  },

  // Delete food
  deleteFood: async (req, res) => {
    // Verify the admin is making the request
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    try {
      const food = await Food.findByIdAndDelete(req.params.id);
      if (!food) {
        return res.status(404).json({ message: 'Food not found' });
      }
      res.status(200).json({ message: 'Food deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  // Add new category
  addCategory: async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }

      const { name, description } = req.body;
      const existingCategory = await Category.findOne({ name });

      if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists' });
      }

      const newCategory = new Category({
        name,
        description,
      });

      const savedCategory = await newCategory.save();
      res.status(201).json(savedCategory);
    } catch (error) {
      console.error('Error Adding Category:', error.message);
      res.status(500).json({ message: error.message });
    }
  },

  // Delete category
  deleteCategory: async (req, res) => {
    try {
      if (!req.user.isAdmin) {
        return res.status(403).json({ message: 'Access denied: Admins only' });
      }

      const categoryId = req.params.id;
      const category = await Category.findByIdAndDelete(categoryId);

      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }

      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = adminController;