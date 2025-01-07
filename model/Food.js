const mongoose = require("mongoose");

const Foodschem = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
});

module.exports = mongoose.model("Food", Foodschem);
