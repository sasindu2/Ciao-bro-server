const Order = require("../model/Order");
const io = require("../server");
// Get all getallOrder
const getallOrder = async (req, res) => {
  try {
    const allOrder = await Order.find();
    res.status(200).json(allOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching Order", error });
  }
};

//create new order
const createOrder = async (req, res) => {
  try {
    const { customerName, customerTel, tableNumber, products, totalPrice } =
      req.body;

    if (
      !customerName ||
      !customerTel ||
      !tableNumber ||
      !products ||
      !totalPrice
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res
        .status(400)
        .json({ message: "Products must be a non-empty array" });
    }

    const newOrder = new Order({
      customerName,
      customerTel,
      tableNumber,
      products,
      totalPrice,
    });

    await newOrder.save();

    // Emit the new order event to all connected clients
    const io = req.app.get("socketio");
    io.emit("newOrder", { message: "New order created", order: newOrder });
    
    res
      .status(201)
      .json({ message: "Order created successfully", order: newOrder });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating order", error });
  }
};

//order status change
const orderstatuschange = async (req, res) => {
  try {
    const { id } = req.params;
    const { order_status } = req.body;

    if (!id) {
      return res.status(400).json({ message: "order ID is required." });
    }

    const validStatuses = [
      "pending",
      "in_progress",
      "delivered",
      "completed",
      "rejected",
    ];
    if (!validStatuses.includes(order_status)) {
      return res.status(400).json({ message: "Invalid order status provided" });
    }

    const checkorder = await Order.findOne({ _id: id });
    if (checkorder) {
      const order = await Order.findOneAndUpdate(
        { _id: id },
        { order_status },
        { new: true }
      );

      res.status(200).json({ message: "update done", data: order });
    } else {
      res.status(404).json({ message: "Not fount order", error });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error changing status order", error });
  }
};

//order delete
const deleteorder = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "order ID is required." });
    }
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Food not found." });
    }

    res.status(200).json({
      message: "Food Order successfully delete",
      Food: deletedOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting status order", error });
  }
};

module.exports = { getallOrder, createOrder, orderstatuschange,deleteorder };
