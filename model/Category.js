const mongoose = require("mongoose");

const Categoryschem = new mongoose.Schema({
  category_name: { type: String, required: true,unique: true  },
  image: { type: String, required: true }
});

module.exports = mongoose.model("Category ", Categoryschem);
