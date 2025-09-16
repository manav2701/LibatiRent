const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Enter product Name"],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please Enter product Description"],
  },
  sku: {
    type: String,
    trim: true,
    unique: true,
    sparse: true, // <-- ADD THIS LINE
    default: undefined // <-- ADD THIS LINE to avoid null
  },
  info: {
    type: String,
  },
  location: {
    type: String,
    default: "Dubai, UAE",
  },
  
  // Sports Category
  sportsCategory: {
    type: String,
    required: [true, "Please select a sports category"],
    enum: ["Tennis", "Padel", "Golf", "Beach Tennis", "Accessories"],
  },

  // Rental Pricing Structure
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

  // Tennis Specific Specifications
  tennisSpecs: {
    brand: String,
    headSize: String,
    gripSize: String,
    stringPattern: String,
    unstrungWeight: Number,
    length: {
      type: Number,
      default: 27,
    },
  },

  // Padel Specific Specifications
  padelSpecs: {
    brand: String,
    weight: Number,
    shape: String,
    balance: String,
    coreMaterial: String,
    surface: String,
  },

  // Free Items Included
  freeItems: [{
    name: String,
    quantity: {
      type: Number,
      default: 1,
    },
    description: String,
  }],

  // Key Features
  keyFeatures: [String],

  // Availability
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

  // Legacy fields for backward compatibility
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ["Tennis", "Padel", "Golf", "Beach Tennis", "Accessories"],
  },

  Stock: {
    type: Number,
    required: [true, "Please Enter product Stock"],
    maxLength: [4, "Stock cannot exceed 4 characters"],
    default: 1,
  },

  ratings: {
    type: Number,
    default: 0,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "userModel",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "userModel",
    required: true,
  },

  images: [
    {
      product_id: {
        type: String,
        default: "default_product_image",
      },
      url: {
        type: String,
        default: "https://via.placeholder.com/300x300/cccccc/000000?text=Product",
      },
    },
  ],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("ProductModel", productSchema);