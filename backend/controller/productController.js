const Product = require("../model/ProductModel");
const ErrorHandler = require("../utils/errorHandler");
const asyncWrapper = require("../middleWare/asyncWrapper");
const ApiFeatures = require("../utils/apiFeatures");
// if productUtils uses ES exports, adapt accordingly; example for commonjs:
const { parseAvailability } = require("../utils/productUtils"); 
// (or use destructured import if utils is commonjs)

// Utility to calculate rental price given product and start/end datetimes
function calculateRentalPrice(product, pickupDateTime, returnDateTime) {
  // Use new pricing model if available, else fallback to legacy
  let firstHour = 0, subsequentHour = 100;
  if (product.rentalPricing) {
    if (product.rentalPricing.firstHourPrice !== undefined) {
      firstHour = product.rentalPricing.firstHourPrice;
      subsequentHour = product.rentalPricing.subsequentHourPrice ?? 100;
    } else if (product.rentalPricing.oneHour?.current !== undefined) {
      firstHour = product.rentalPricing.oneHour.current;
      subsequentHour = 100;
    }
  }
  // Calculate total hours (round up to next full hour)
  const ms = returnDateTime - pickupDateTime;
  let hours = Math.ceil(ms / (60 * 60 * 1000));
  if (hours < 1) hours = 1;
  if (hours === 1) return firstHour;
  return firstHour + subsequentHour * (hours - 1);
}

// Create Product -- Admin
exports.createProduct = asyncWrapper(async (req, res, next) => {
  let images = [];
  
  // Handle image uploads (without Cloudinary)
  if (req.body.images) {
    if (typeof req.body.images === "string") {
      images.push({
        product_id: "product_image_1",
        url: req.body.images
      });
    } else {
      req.body.images.forEach((img, index) => {
        images.push({
          product_id: `product_image_${index + 1}`,
          url: img
        });
      });
    }
  }

  // New rental pricing input
  let rentalPricing = {
    firstHourPrice: 0,
    subsequentHourPrice: 100
  };
  if (req.body.firstHourPrice) {
    rentalPricing.firstHourPrice = Number(req.body.firstHourPrice);
  }
  if (req.body.subsequentHourPrice) {
    rentalPricing.subsequentHourPrice = Number(req.body.subsequentHourPrice);
  }

  // Validate that at least one pricing tier is set
  const hasValidPricing = rentalPricing.firstHourPrice > 0 || rentalPricing.subsequentHourPrice > 0;
  if (!hasValidPricing) {
    return next(new ErrorHandler("At least one rental pricing tier must be set", 400));
  }

  let availability = {};
  if (req.body.availability) {
    try {
      availability = parseAvailability(typeof req.body.availability === "string" ? JSON.parse(req.body.availability) : req.body.availability);
    } catch (e) {
      console.error("availability parse error:", e);
      // fallback to defaults
      availability = {
        availableFrom: { date: new Date(), time: "09:00" },
        availableTo: { date: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), time: "21:00" }
      };
    }
  } else {
    availability = {
      availableFrom: { date: new Date(), time: "09:00" },
      availableTo: { date: new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000), time: "21:00" }
    };
  }

  // Process specs and other fields
  let tennisSpecs = {};
  if (req.body.tennisSpecs && req.body.sportsCategory === "Tennis") {
    try {
      tennisSpecs = JSON.parse(req.body.tennisSpecs);
    } catch (error) {
      console.error("Error parsing tennis specs:", error);
    }
  }

  let padelSpecs = {};
  if (req.body.padelSpecs && req.body.sportsCategory === "Padel") {
    try {
      // Accept both stringified and object padelSpecs
      if (typeof req.body.padelSpecs === "string") {
        padelSpecs = JSON.parse(req.body.padelSpecs);
      } else if (typeof req.body.padelSpecs === "object") {
        padelSpecs = req.body.padelSpecs;
      }
    } catch (error) {
      console.error("Error parsing padel specs:", error);
      padelSpecs = {};
    }
  }

  let freeItems = [];
  if (req.body.freeItems) {
    try {
      freeItems = JSON.parse(req.body.freeItems);
    } catch (error) {
      console.error("Error parsing free items:", error);
    }
  }

  let keyFeatures = [];
  if (req.body.keyFeatures) {
    keyFeatures = req.body.keyFeatures.split(',').map(feature => feature.trim()).filter(f => f);
  }

  // Create product data
  const productData = {
    name: req.body.name.trim(),
    description: req.body.description.trim(),
    sku: req.body.sku ? req.body.sku.trim() : undefined,
    Stock: parseInt(req.body.Stock) || 1,
    info: req.body.info ? req.body.info.trim() : undefined,
    location: req.body.location || "Dubai, UAE",
    sportsCategory: req.body.sportsCategory,
    category: req.body.category || req.body.sportsCategory,
    price: rentalPricing.firstHourPrice, // Legacy price field - use first hour price
    rentalPricing: rentalPricing,
    availability: availability,
    images: images,
    freeItems: freeItems,
    keyFeatures: keyFeatures,
    user: req.user.id
  };

  // Add sport-specific specs
  if (req.body.sportsCategory === "Tennis" && Object.keys(tennisSpecs).length > 0) {
    productData.tennisSpecs = tennisSpecs;
  }
  if (req.body.sportsCategory === "Padel" && Object.keys(padelSpecs).length > 0) {
    productData.padelSpecs = padelSpecs;
  }

  const product = await Product.create(productData);

  res.status(201).json({
    success: true,
    product,
  });
});

// Build epoch ms from a date + "HH:mm" time, interpreted in Dubai (+04:00)
function buildMillisDubai(dateLike, timeStr) {
  if (!dateLike) return null;

  // Ensure we have a valid date
  let dateObj;
  if (dateLike instanceof Date) {
    dateObj = dateLike;
  } else {
    dateObj = new Date(dateLike);
  }
  
  if (isNaN(dateObj)) return null;
  
  // Get date in YYYY-MM-DD format in UTC
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  const dateOnly = `${year}-${month}-${day}`;

  // Parse time
  const time = (typeof timeStr === "string" && timeStr.length >= 4) ? timeStr : "00:00";
  const [hours = "0", minutes = "0"] = time.split(":");
  
  // Create Dubai time and convert to UTC milliseconds
  // Dubai is UTC+4, so we subtract 4 hours to get UTC
  const dubaiDateTime = new Date(`${dateOnly}T${time}:00+04:00`);
  
  if (isNaN(dubaiDateTime)) {
    console.error(`Invalid Dubai date time: ${dateOnly}T${time}:00+04:00`);
    return null;
  }
  
  return dubaiDateTime.getTime();
}

// Fixed availability check
function checkProductAvailability(product, pickupDateTime, returnDateTime) {
  if (!product || product.Stock <= 0) {
    return false;
  }

  // Convert to timestamps for comparison
  const pickupMs = pickupDateTime.getTime();
  const returnMs = returnDateTime.getTime();

  const availability = product.availability || {};
  const availableFromDate = availability?.availableFrom?.date;
  const availableFromTime = availability?.availableFrom?.time || "00:00";
  const availableToDate = availability?.availableTo?.date;
  const availableToTime = availability?.availableTo?.time || "23:59";

  // Build Dubai time objects for availability window
  const availableFromDubai = buildDubaiDateTime(availableFromDate, availableFromTime);
  const availableToDubai = buildDubaiDateTime(availableToDate, availableToTime);

  if (!availableFromDubai || !availableToDubai) {
    return false;
  }

  const availFromMs = availableFromDubai.getTime();
  const availToMs = availableToDubai.getTime();

  // Check availability window
  if (pickupMs < availFromMs) {
    return false;
  }
  if (returnMs > availToMs) {
    return false;
  }
  return true;
}

// CORRECTED VERSION
function buildDubaiDateTime(dateLike, timeStr) {
  if (!dateLike) return null;
  let dateObj;
  if (dateLike instanceof Date) {
    dateObj = dateLike;
  } else {
    dateObj = new Date(dateLike);
  }
  if (isNaN(dateObj)) return null;
  
  // Use UTC methods to avoid server timezone issues
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');
  
  const dateOnly = `${year}-${month}-${day}`;
  const time = (typeof timeStr === "string" && timeStr.length >= 4) ? timeStr : "00:00";
  const dubaiDateTime = new Date(`${dateOnly}T${time}:00+04:00`);
  
  if (isNaN(dubaiDateTime)) {
    console.error(`Invalid Dubai date time constructed: ${dateOnly}T${time}:00+04:00`);
    return null;
  }
  return dubaiDateTime;
}

/* ------------------- Controllers ------------------- */

// Get All Products
exports.getAllProducts = asyncWrapper(async (req, res, next) => {
  const resultPerPage = 8;
  const productsCount = await Product.countDocuments();

  // Build base query (search & filters)
  let apiFeature = new ApiFeatures(Product.find(), req.query).search().filter();

  // Execute MongoDB query
  let products = await apiFeature.query;
  let filteredProductCount = products.length;

  // Apply JavaScript time-of-day filtering if we have date/time filters
  let pickupDateTime, returnDateTime;
  if (
    req.query.pickupDate && req.query.pickupTime &&
    req.query.returnDate && req.query.returnTime
  ) {
    // Create Dubai timezone dates for precise time filtering
    pickupDateTime = new Date(`${req.query.pickupDate}T${req.query.pickupTime}:00+04:00`);
    returnDateTime = new Date(`${req.query.returnDate}T${req.query.returnTime}:00+04:00`);

    const beforeJSFilter = products.length;
    products = products.filter(p => checkProductAvailability(p, pickupDateTime, returnDateTime));
    filteredProductCount = products.length;

    console.log(`[filter] After JS time filter: ${beforeJSFilter} -> ${filteredProductCount} products`);
  }

  // Manual pagination
  const currentPage = Number(req.query.page) || 1;
  const start = (currentPage - 1) * resultPerPage;
  const paginatedProducts = products.slice(start, start + resultPerPage);

  // Only declare pickupDateTime/returnDateTime ONCE above, do not redeclare here!
  // Calculate rental price for each product if applicable
  const productsWithPrice = paginatedProducts.map(p => {
    let rentalPrice = null;
    if (pickupDateTime && returnDateTime) {
      rentalPrice = calculateRentalPrice(p, pickupDateTime, returnDateTime);
    }
    return { ...p.toObject(), rentalPrice };
  });
  res.status(200).json({
    success: true,
    products: productsWithPrice,
    productsCount,         // total in DB
    resultPerPage,
    filteredProductCount,  // after all filters
  });

  // Debug log
  console.log("Final results:", {
    total: filteredProductCount,
    returned: paginatedProducts.length,
    productNames: paginatedProducts.map(p => p.name),
    requestedPeriod: (pickupDateTime && returnDateTime) ? {
      pickup: pickupDateTime.toISOString(),
      return: returnDateTime.toISOString()
    } : null,
  });
});

// Check availability for a single product
exports.checkAvailability = asyncWrapper(async (req, res, next) => {
  const { productId, pickupDate, pickupTime, returnDate, returnTime } = req.body;
  if (!productId || !pickupDate || !pickupTime) {
    return next(new ErrorHandler("Product ID, pickup date and time are required", 400));
  }
  // Validate date formats
  if (!/^\d{4}-\d{2}-\d{2}$/.test(pickupDate) || (returnDate && !/^\d{4}-\d{2}-\d{2}$/.test(returnDate))) {
    return next(new ErrorHandler("Invalid date format. Use YYYY-MM-DD", 400));
  }

  const product = await Product.findById(productId);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  const pickupDateTime = new Date(`${pickupDate}T${pickupTime}:00+04:00`);
  const returnDateTime = returnDate && returnTime
    ? new Date(`${returnDate}T${returnTime}:00+04:00`)
    : new Date(pickupDateTime.getTime() + 2 * 60 * 60 * 1000); // default +2h

  const isAvailable = checkProductAvailability(product, pickupDateTime, returnDateTime);
  const rentalPrice = calculateRentalPrice(product, pickupDateTime, returnDateTime);

  res.status(200).json({
    success: true,
    available: isAvailable,
    product: {
      _id: product._id,
      name: product.name,
      Stock: product.Stock,
      rentalPrice
    },
    requestedPeriod: {
      pickup: pickupDateTime,
      return: returnDateTime,
    }
  });
});

// Get Product Details
exports.getProductDetails = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new ErrorHandler("Product not found", 404));

  res.status(200).json({
    success: true,
    product,
  });
});

// Update Product -- Admin
exports.updateProduct = asyncWrapper(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  // Handle image updates if provided
  let images = product.images; // Keep existing images by default
  
  if (req.body.images) {
    images = [];
    if (typeof req.body.images === "string") {
      images.push({
        product_id: "product_image_1",
        url: req.body.images
      });
    } else {
      req.body.images.forEach((img, index) => {
        images.push({
          product_id: `product_image_${index + 1}`,
          url: img
        });
      });
    }
  }

  // Update rental pricing if provided
  let rentalPricing = product.rentalPricing;
  if (req.body.firstHourPrice || req.body.subsequentHourPrice) {
    rentalPricing = {
      firstHourPrice: Number(req.body.firstHourPrice) || rentalPricing.firstHourPrice || 0,
      subsequentHourPrice: Number(req.body.subsequentHourPrice) || rentalPricing.subsequentHourPrice || 100
    };
  }

  // Process availability if provided
  let availability = product.availability;
  if (req.body.availability) {
    try {
      availability = parseAvailability(typeof req.body.availability === "string" ? JSON.parse(req.body.availability) : req.body.availability);
    } catch (error) {
      console.error("Error parsing availability:", error);
    }
  }

  // Process other fields
  let tennisSpecs = product.tennisSpecs || {};
  if (req.body.tennisSpecs && req.body.sportsCategory === "Tennis") {
    try {
      tennisSpecs = JSON.parse(req.body.tennisSpecs);
    } catch (error) {
      console.error("Error parsing tennis specs:", error);
    }
  }

  let padelSpecs = product.padelSpecs || {};
  if (req.body.padelSpecs && req.body.sportsCategory === "Padel") {
    try {
      // Accept both stringified and object padelSpecs
      if (typeof req.body.padelSpecs === "string") {
        padelSpecs = JSON.parse(req.body.padelSpecs);
      } else if (typeof req.body.padelSpecs === "object") {
        padelSpecs = req.body.padelSpecs;
      }
    } catch (error) {
      console.error("Error parsing padel specs:", error);
      padelSpecs = {};
    }
  }

  let freeItems = product.freeItems || [];
  if (req.body.freeItems) {
    try {
      freeItems = JSON.parse(req.body.freeItems);
    } catch (error) {
      console.error("Error parsing free items:", error);
    }
  }

  let keyFeatures = product.keyFeatures || [];
  if (req.body.keyFeatures) {
    keyFeatures = req.body.keyFeatures.split(',').map(feature => feature.trim()).filter(f => f);
  }

  // Update product data
  const updateData = {
    name: req.body.name || product.name,
    description: req.body.description || product.description,
    sku: req.body.sku || product.sku,
    Stock: req.body.Stock ? parseInt(req.body.Stock) : product.Stock,
    info: req.body.info || product.info,
    location: req.body.location || product.location,
    sportsCategory: req.body.sportsCategory || product.sportsCategory,
    category: req.body.category || req.body.sportsCategory || product.category,
    price: rentalPricing.oneHour.current, // Legacy price field
    rentalPricing: rentalPricing,
    availability: availability,
    images: images,
    freeItems: freeItems,
    keyFeatures: keyFeatures,
  };

  // Add sport-specific specs
  if (req.body.sportsCategory === "Tennis" && Object.keys(tennisSpecs).length > 0) {
    updateData.tennisSpecs = tennisSpecs;
  }
  if (req.body.sportsCategory === "Padel" && Object.keys(padelSpecs).length > 0) {
    updateData.padelSpecs = padelSpecs;
  }

  product = await Product.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

// Delete Product -- Admin
exports.deleteProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Product Deleted Successfully",
  });
});

// Create New Review or Update the review
exports.createProductReview = asyncWrapper(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });

  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get All Reviews of a product
exports.getProductReviews = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });

  let ratings = 0;

  if (reviews.length === 0) {
    ratings = 0;
  } else {
    ratings = avg / reviews.length;
  }

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});

// Get Products - Admin
exports.getAdminProducts = asyncWrapper(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    success: true,
    products,
  });
});

// Get dynamic filter options for Tennis and Padel
exports.getProductFilters = asyncWrapper(async (req, res, next) => {
  // Get all products
  const products = await Product.find();

  // Tennis filters
  const tennisBrands = new Set();
  const tennisHeadSizes = new Set();
  const tennisGripSizes = new Set();

  // Padel filters
  const padelBrands = new Set();
  const padelShapes = new Set();

  products.forEach((product) => {
    if (product.sportsCategory === "Tennis" && product.tennisSpecs) {
      if (product.tennisSpecs.brand && product.tennisSpecs.brand.trim() !== "") tennisBrands.add(product.tennisSpecs.brand.trim());
      if (product.tennisSpecs.headSize && product.tennisSpecs.headSize.trim() !== "") tennisHeadSizes.add(product.tennisSpecs.headSize.trim());
      if (product.tennisSpecs.gripSize && product.tennisSpecs.gripSize.trim() !== "") tennisGripSizes.add(product.tennisSpecs.gripSize.trim());
    }
    if (product.sportsCategory === "Padel" && product.padelSpecs) {
      if (product.padelSpecs.brand && product.padelSpecs.brand.trim() !== "") padelBrands.add(product.padelSpecs.brand.trim());
      if (product.padelSpecs.shape && product.padelSpecs.shape.trim() !== "") padelShapes.add(product.padelSpecs.shape.trim());
    }
  });

  res.status(200).json({
    success: true,
    tennis: {
      brands: Array.from(tennisBrands),
      headSizes: Array.from(tennisHeadSizes),
      gripSizes: Array.from(tennisGripSizes),
    },
    padel: {
      brands: Array.from(padelBrands),
      shapes: Array.from(padelShapes),
    },
  });
});

// Helper function to get duration in hours
function getDurationInHours(duration) {
  switch (duration) {
    case 'oneHour': return 1;
    case 'fourHours': return 4;
    case 'eightHours': return 8;
    case 'oneDay': return 24;
    default: return 1;
  }
}