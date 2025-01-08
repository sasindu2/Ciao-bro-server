const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    customerTel: { type: String, required: true },
    tableNumber: { type: String, required: true },
    products: [
      {
        id:{ type: String, required: true },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: String, required: true },
        qty: { type: String, required: true },
      },
    ],
    totalPrice: { type: String, required: true },
    order_status: {
      type: String,
      enum: ["pending", "in_progress", "delivered", "completed", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Order", OrderSchema);
