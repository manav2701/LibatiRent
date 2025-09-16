// Remove these lines (they are not needed and cause ESM/CJS issues):
// import Product from "../models/productModel.js";
// import ErrorHandler from "../utils/errorHandler.js";
// import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
// import ApiFeatures from "../utils/apiFeatures.js";

// Only keep the parseAvailability function and its export:
// Updated parseAvailability function for productUtils.js
function parseAvailability(availability) {
  if (!availability) {
    const now = new Date();
    const sixMonthsLater = new Date(now.getTime() + 6 * 30 * 24 * 60 * 60 * 1000);
    
    return {
      availableFrom: {
        date: now,
        time: "09:00"
      },
      availableTo: {
        date: sixMonthsLater,
        time: "21:00"
      }
    };
  }

  const { availableFrom = {}, availableTo = {} } = availability;

  // Parse dates - handle both string and Date inputs
  let fromDate = availableFrom.date;
  if (typeof fromDate === 'string') {
    // If it's a date string like "2025-08-25", treat as date-only
    if (fromDate.includes('T')) {
      fromDate = new Date(fromDate);
    } else {
      // For date-only strings, create Date at midnight UTC
      fromDate = new Date(fromDate + 'T00:00:00.000Z');
    }
  } else if (fromDate instanceof Date) {
    // Keep existing Date object
    fromDate = new Date(fromDate);
  } else {
    // Default to current date
    fromDate = new Date();
  }

  let toDate = availableTo.date;
  if (typeof toDate === 'string') {
    if (toDate.includes('T')) {
      toDate = new Date(toDate);
    } else {
      // For date-only strings, create Date at midnight UTC
      toDate = new Date(toDate + 'T00:00:00.000Z');
    }
  } else if (toDate instanceof Date) {
    // Keep existing Date object
    toDate = new Date(toDate);
  } else {
    // Default to 6 months from now
    toDate = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000);
  }

  // Validate dates
  if (isNaN(fromDate.getTime())) {
    console.warn('Invalid availableFrom date, using current date');
    fromDate = new Date();
  }
  
  if (isNaN(toDate.getTime())) {
    console.warn('Invalid availableTo date, using 6 months from now');
    toDate = new Date(Date.now() + 6 * 30 * 24 * 60 * 60 * 1000);
  }

  // Validate times
  const fromTime = availableFrom.time || "09:00";
  const toTime = availableTo.time || "21:00";
  
  // Simple time validation (HH:MM format)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  
  const validFromTime = timeRegex.test(fromTime) ? fromTime : "09:00";
  const validToTime = timeRegex.test(toTime) ? toTime : "21:00";

  // Ensure fromDate is not after toDate
  if (fromDate > toDate) {
    console.warn('availableFrom date is after availableTo date, swapping dates');
    [fromDate, toDate] = [toDate, fromDate];
  }

  return {
    availableFrom: {
      date: fromDate,
      time: validFromTime
    },
    availableTo: {
      date: toDate,
      time: validToTime
    }
  };
}

module.exports = { parseAvailability };
