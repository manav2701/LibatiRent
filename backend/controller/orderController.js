const asyncWrapper = require("../middleWare/asyncWrapper");
const orderModel = require("../model/orderModel");
const productModel = require("../model/ProductModel");
const ErrorHandler = require("../utils/errorHandler");

//>>>>>>>>>>>>>>>  create a order    >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.newOrder = asyncWrapper(async (req, res, next) => {
  const {
    deliveryAddress,
    pickupAddress,
    rentalInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  // Validate rental dates
  if (
    !rentalInfo ||
    !rentalInfo.deliveryDate ||
    !rentalInfo.deliveryTime ||
    !rentalInfo.pickupDate ||
    !rentalInfo.pickupTime
  ) {
    return next(new ErrorHandler("Rental delivery and pickup date/time required", 400));
  }

  // Validate addresses (now using countryCode)
  if (
    !deliveryAddress ||
    !pickupAddress ||
    !deliveryAddress.address ||
    !pickupAddress.address ||
    !deliveryAddress.countryCode ||
    !pickupAddress.countryCode
  ) {
    return next(new ErrorHandler("Both delivery and pickup addresses and country codes are required", 400));
  }

  // Check if any products in the order are available for the rental period
  for (const item of orderItems) {
    const product = await productModel.findById(item.productId);
    if (!product) {
      return next(new ErrorHandler(`Product ${item.name} not found`, 404));
    }
    
    // Check availability window
    if (product.availability) {
      const availableFrom = product.availability.availableFrom?.date;
      const availableTo = product.availability.availableTo?.date;
      
      if (availableFrom && rentalInfo.pickupDate < availableFrom) {
        return next(new ErrorHandler(`Product ${item.name} is not available from the selected pickup date`, 400));
      }
      
      if (availableTo && rentalInfo.returnDate > availableTo) {
        return next(new ErrorHandler(`Product ${item.name} is not available until the selected return date`, 400));
      }
    }
  }

  // create order :
  const order = await orderModel.create({
    deliveryAddress,
    pickupAddress,
    rentalInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    user: req.user._id,
    paidAt: Date.now(),
  });

  res.status(201).json({
    success: true,
    order,
  });
});

//>>>>>>>>>>>> getSingleOrder >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.getSingleOrder = asyncWrapper(async (req, res, next) => {
  const order = await orderModel
    .findById(req.params.id)
    .populate({ path: "user", select: "name email" });
  if (!order) {
    return next(new ErrorHandler("Order not found with this Id", 404));
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// >>>>>>>>>>>>>>>> getUsers all orders >>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.myOrders = asyncWrapper(async (req, res) => {
  const userOrders = await orderModel.find({ user: req.user._id }); // this id from authentictaion user.req

  res.status(200).json({
    success: true,
    userOrders,
  });
});

//>>>>>>>>>>>>>>>>>>>>>>>>>>> get all Orders -- Admin>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

exports.getAllOrders = asyncWrapper(async (req, res, next) => {
  const orders = await orderModel.find();

  let totalAmount = 0;
  // count total price of all order for dashbord
  orders.forEach((order) => {
    totalAmount += order.totalPrice;
  });

  res.status(200).json({
    success: true,
    totalAmount,
    orders,
  });
});

// update Order Status -- Admin
exports.updateOrder = asyncWrapper(async (req, res, next) => {
   
  const order = await orderModel.findById(req.params.id);

    
  if (!order) {
    return next(new ErrorHandler("Order not found with this id", 400));
  }
  if (order.orderStatus === "Delivered") {
    return next(new ErrorHandler("You have already delivered this order", 400));
  }

  // when orderd is shipped and need to update order status to deliverd then. pass order id updateStock function and also pass quantity of the product
  // orderItems is the array of object in orderSchema with {name , productId , quantity , phoneNo .. so on}propoerty
    if (req.body.status === "Shipped"){
 order.orderItems.forEach(async (orderItem) => {
   await updateStock(orderItem.productId, orderItem.quantity);
 });
    }
 

  // once order quantity is reduced in productModel then update status as oredrStatus well
  order.orderStatus = req.body.status;
 
  // now also set delivery time once order Delivered:
  if (order.orderStatus === "Delivered") {
    order.deliveredAt = Date.now();
  }

  // save to DataBase
  await order.save({ validateBeforeSave: false });
  res.status(200).json({
    success: true,
  });
});

// update status function with. productId and quantity params
async function updateStock(id, quantity) {
  try {
    const product = await productModel.findById(id);
    if (!product) {
      throw new ErrorHandler("Product not found", 404); 
    }

    // Update the stock of the product using the order quantity
    product.Stock -= quantity;

    await product.save({ validateBeforeSave: false });
  } catch (error) {
    throw new ErrorHandler("Product not found", 404); 
  }
}

// Add a helper function to check existing rentals for a product
async function checkExistingRentals(productId, pickupDate, returnDate) {
  try {
    // Find orders that overlap with the requested rental period
    const overlappingOrders = await orderModel.find({
      "orderItems.productId": productId,
      "rentalInfo.pickupDate": { $lte: returnDate },
      "rentalInfo.returnDate": { $gte: pickupDate },
      orderStatus: { $nin: ["Cancelled", "Delivered"] } // Exclude cancelled and delivered orders
    });
    
    return overlappingOrders.length > 0;
  } catch (error) {
    console.error("Error checking existing rentals:", error);
    return false;
  }
}

//>>>>>>>>>>>>>>>>>>>>> delete Order -- Admin >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.deleteOrder = asyncWrapper(async (req, res, next) => {
  const order = await orderModel.findById(req.params.id);

  if (!order) {
    return next(new ErrorHandler("Order not found with given Id", 400));
  }

  await orderModel.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Order deleted successfully",
  });
});
