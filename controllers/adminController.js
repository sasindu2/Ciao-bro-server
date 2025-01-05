const Food = require('../models/Food');
const Category = require('../models/Category');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if it doesn't exist
const uploadDir = 'public/uploads/foods';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter for images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, JPG, PNG, and WEBP files are allowed'), false);
    }
};

// Create multer upload middleware
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
}).single('image');

// Controller methods
const adminController = {
    // Get all foods
    getAllFoods: async (req, res) => {
        try {
            const foods = await Food.find().populate('category');
            res.status(200).json(foods);
        } catch (error) {
            console.error('Error fetching foods:', error);
            res.status(500).json({ message: 'Error fetching foods', error: error.message });
        }
    },

    // Add new food
    addFood: async (req, res) => {
        try {
            // Log incoming request data for debugging
            console.log('Request body:', req.body);
            console.log('Request file:', req.file);

            if (!req.file) {
                return res.status(400).json({ message: 'Please upload an image' });
            }

            const { name, categoryId, price, description } = req.body;

            // Validate required fields
            if (!name || !categoryId || !price || !description) {
                return res.status(400).json({ 
                    message: 'All fields are required (name, categoryId, price, description)' 
                });
            }

            // Validate category
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            // Create new food item
            const newFood = new Food({
                name,
                category: categoryId,
                price: Number(price),
                description,
                image: `/uploads/foods/${req.file.filename}`,
                addedBy: req.user._id,
            });

            const savedFood = await newFood.save();
            
            // Return success response
            res.status(201).json({ 
                message: 'Food item added successfully', 
                food: savedFood 
            });

        } catch (error) {
            console.error('Error Adding Food:', error);
            if (req.file) {
                // Clean up uploaded file if there was an error
                fs.unlink(req.file.path, (unlinkError) => {
                    if (unlinkError) console.error('Error deleting file:', unlinkError);
                });
            }
            res.status(500).json({ message: 'Error adding food item', error: error.message });
        }
    },

    // Update food
    updateFood: async (req, res) => {
        try {
            const foodId = req.params.id;
            const updates = req.body;

            // If new file is uploaded
            if (req.file) {
                updates.image = `/uploads/foods/${req.file.filename}`;
                
                // Delete old image if it exists
                const oldFood = await Food.findById(foodId);
                if (oldFood && oldFood.image) {
                    const oldImagePath = path.join('public', oldFood.image);
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
            }

            const food = await Food.findByIdAndUpdate(
                foodId,
                { ...updates, lastModifiedBy: req.user._id },
                { new: true }
            ).populate('category');

            if (!food) {
                return res.status(404).json({ message: 'Food not found' });
            }

            res.status(200).json({ message: 'Food updated successfully', food });
        } catch (error) {
            console.error('Error Updating Food:', error);
            if (req.file) {
                fs.unlink(req.file.path, (unlinkError) => {
                    if (unlinkError) console.error('Error deleting file:', unlinkError);
                });
            }
            res.status(500).json({ message: 'Error updating food item', error: error.message });
        }
    },

    // Delete food
    deleteFood: async (req, res) => {
      try {
          const food = await Food.findById(req.params.id);
          if (!food) {
              return res.status(404).json({ message: 'Food not found' });
          }

          // Delete associated image file if it exists
          if (food.image && !food.image.startsWith('http')) {
              const imagePath = path.join('public', food.image);
              if (fs.existsSync(imagePath)) {
                  fs.unlinkSync(imagePath);
              }
          }

          await food.deleteOne();
          res.status(200).json({ message: 'Food deleted successfully' });
      } catch (error) {
          console.error('Error Deleting Food:', error);
          res.status(500).json({ message: 'Error deleting food item', error: error.message });
      }
  },

    addCategory: async (req, res) => {
      try {
          const { name } = req.body;
  
          // Validate required fields
          if (!name) {
              return res.status(400).json({ message: 'Category name is required' });
          }
  
          // Create new category
          const newCategory = new Category({ name });
          const savedCategory = await newCategory.save();
  
          res.status(201).json({ message: 'Category added successfully', category: savedCategory });
      } catch (error) {
          console.error('Error Adding Category:', error);
          res.status(500).json({ message: 'Error adding category', error: error.message });
      }
  },
  deleteCategory: async (req, res) => {
    try {
      const category = await Category.findById(req.params.id);
      if (!category) {
        return res.status(404).json({ message: 'Category not found' });
      }
  
      await category.deleteOne();
      res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
      console.error('Error Deleting Category:', error);
      res.status(500).json({ message: 'Error deleting category', error: error.message });
    }
  },
  

    // Upload middleware for routes
    uploadMiddleware: (req, res, next) => {
        upload(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json({ message: 'File upload error', error: err.message });
            } else if (err) {
                return res.status(400).json({ message: 'Invalid file type', error: err.message });
            }
            next();
        });
    }
};

module.exports = adminController;