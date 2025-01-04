const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  cart: [
    {
      foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      quantity: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model('User', userSchema);

// const mongoose = require('mongoose');

// // Define User schema
// const userSchema = new mongoose.Schema(
//     {
//         name: { type: String, required: true },
//         email: { type: String, required: true, unique: true },
//         password: { type: String, required: true },
//     },
//     { timestamps: true }
// );

// // Create and export the User model
// const User = mongoose.model('User', userSchema);
// module.exports = User;
