const Category = require("../model/Category");

// Get all Category
const getAllCategory = async (req, res) => {
  try {
    const allCategory = await Category.find();
    res.status(200).json(allCategory);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching Category", error });
  }
};

// Create a Category
const createCategory = async (req, res) => {
  try {
    const { category_name, image } = req.body;
    const newCategory = new Category({ category_name, image });
    const saveCategory = await newCategory.save();
    res.status(201).json(saveCategory);
  } catch (error) {
    res.status(500).json({ message: "Error creating Category", error });
  }
};

//update category
const updatecategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    res.status(200).json({
      message: "Category updated successfully.",
      category: updatedCategory,
    });
  } catch (error) {
    res.status(500).json({ message: "Error Updating Category", error });
  }
};

const deletecategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Category ID is required." });
    }

    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }

    res
      .status(200)
      .json({
        message: "Category deleted successfully.",
        category: deletedCategory,
    
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Category", error });
  }
};

module.exports = { getAllCategory, createCategory, updatecategory ,deletecategory };
