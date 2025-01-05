const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String, 
    default: "https://th.bing.com/th/id/OIP.RWaaZCnAJwE8O0FxwD7y0AHaEo?rs=1&pid=ImgDetMain", 

  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: true,
  },
});

module.exports = mongoose.model('Food', foodSchema);
