const mongoose = require("mongoose");


const orderSchema = new mongoose.Schema({
  // Delivery Address
  deliveryAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String, required: true },
    phoneNo: { type: String, required: true },
  },
  // Pickup Address
  pickupAddress: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pinCode: { type: String, required: true },
    phoneNo: { type: String, required: true },
  },
  // Availability (Rental period for the order)
  availability: {
    availableFrom: {
      date: {
        type: Date,
        required: [true, "Please enter available from date"],
        default: Date.now,
      },
      time: {
        type: String,
        required: [true, "Please enter available from time"],
        default: "09:00",
      },
    },
    availableTo: {
      date: {
        type: Date,
        required: [true, "Please enter available to date"],
        default: function() {
          const date = new Date();
          date.setMonth(date.getMonth() + 6);
          return date;
        },
      },
      time: {
        type: String,
        required: [true, "Please enter available to time"],
        default: "21:00",
      },
    },
  },
  // order item details array
  orderItems: [
    {
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      image: { type: String, required: true },
      productId: {
        type: mongoose.Schema.ObjectId,
        ref: "ProductModel",
        required: true,
      },
      // Rental pricing for this item
      rentalPricing: {
        firstHourPrice: {
          type: Number,
          required: [true, "Please enter first hour rental price"],
          default: 0,
        },
        subsequentHourPrice: {
          type: Number,
          required: [true, "Please enter subsequent hour rental price"],
          default: 100,
        }
      },
      // Optionally, you can keep per-item availability if needed
      // availability: { ... }
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    required: true,
  },
  paymentInfo: {
    id: { type: String, required: true },
    status: { type: String, required: true },
  },
  paidAt: { type: Date },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  orderStatus: {
    type: String,
    required: true,
    default: "Processing",
  },
  deliveredAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("OrdersModel", orderSchema);