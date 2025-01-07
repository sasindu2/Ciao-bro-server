const Food = require("../model/Food");
const Category = require("../model/Category");

// Get all food
const getAllFood = async (req, res) => {
  try {
    const allFood = await Food.find();
    res.status(200).json(allFood);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching Food", error });
  }
};

// Create a Food
const createFood = async (req, res) => {
  try {
    const { name, image, price, description, category } = req.body;
    //checking category
    const checkcate = await Category.findOne({ _id: category });
    if (checkcate) {
      const newFood = new Food({ name, image, price, description, category });
      const savenewFood = await newFood.save();
      res.status(201).json(savenewFood);
    } else {
      res.status(404).json({ message: "Not fount Category", error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating Food", error });
  }
};

//update Food
const updateFood = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedFood = await Food.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedFood) {
      return res.status(404).json({ message: "Food not found." });
    }

    res.status(200).json({
      message: "Food updated successfully.",
      category: updatedFood,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Updating Food", error });
  }
};

const deleteFood = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Food ID is required." });
    }

    const deletedFood = await Food.findByIdAndDelete(id);

    if (!deletedFood) {
      return res.status(404).json({ message: "Food not found." });
    }

    res.status(200).json({
      message: "Food deleted successfully.",
      Food: deletedFood,
    });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Category", error });
  }
};

const categorygetfood = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "category ID is required." });
    }

    const checkcate = await Category.findOne({ _id: id });
    if (checkcate) {
      const foods = await Food.find({ category: id });
      res.status(200).json({ data: foods });
    } else {
      res.status(404).json({ message: "Not fount Category", error });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting Category", error });
  }
};

module.exports = { getAllFood, createFood, updateFood, deleteFood,categorygetfood };
