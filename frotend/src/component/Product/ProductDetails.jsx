// ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@mui/icons-material/Add";
import { IconButton, Input, Typography } from "@mui/material";
import DoneIcon from "@material-ui/icons/Done";
import CloseIcon from "@mui/icons-material/Close";
import CartNotification from "../layouts/CartNotification/CartNotification";
import axios from "axios";

import {
  generateDiscountedPrice,
  calculateDiscount,
  dispalyMoney,
} from "../DisplayMoney/DisplayMoney";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import Rating from "@material-ui/lab/Rating";
import "./ProductDetails.css";
import { useSelector, useDispatch } from "react-redux";
import useActive from "../hook/useActive";
import ReviewCard from "./ReviewCard";
import {
  clearErrors,
  getProductDetails,
} from "../../actions/productAction";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import { addItemToCart, removeItemFromCart } from "../../actions/cartAction";
import CricketBallLoader from "../layouts/loader/Loader";
import Button from "@mui/material/Button";
import { PRODUCT_DETAILS_RESET } from "../../constants/productsConstatns";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import Grid from "@mui/material/Grid";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const alert = useAlert();
  const location = useLocation();

  const [quantity, setQuantity] = useState(1);
  const [previewImg, setPreviewImg] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const { handleActive, activeClass } = useActive(0);

  const { product, loading, error, success } = useSelector(
    (state) => state.productDetails
  );

  const { cartItems } = useSelector((state) => state.cart);

  // Check if item is in cart
  const cartItem = cartItems.find(item => item.product === id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // Rental config state (sync with localStorage)
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [isRentalConfigOpen, setIsRentalConfigOpen] = useState(false);
  const [isConfigurationApplied, setIsConfigurationApplied] = useState(false);

  // Availability check state
  const [availabilityLoading, setAvailabilityLoading] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [isAvailable, setIsAvailable] = useState(null); // null = not checked yet

  // Time options for select
  const timeOptions = [];
  for (let hour = 6; hour <= 23; hour++) {
    timeOptions.push(`${hour.toString().padStart(2, "0")}:00`);
    timeOptions.push(`${hour.toString().padStart(2, "0")}:30`);
  }

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    if (id) {
      dispatch(getProductDetails(id));
    }
    if (success) {
      dispatch({ type: PRODUCT_DETAILS_RESET });
    }
  }, [dispatch, error, alert, success, id]);

  // Update preview image and active tab when product changes
  useEffect(() => {
    if (product && product.images && product.images.length > 0) {
      setPreviewImg(product.images[0].url);
      handleActive(0);
    }
  }, [product, handleActive]);

  // Sync rental config from localStorage on mount
  useEffect(() => {
    const cached = localStorage.getItem("rentalConfig");
    if (cached) {
      try {
        const obj = JSON.parse(cached);
        if (obj.pickupDate) setPickupDate(obj.pickupDate);
        if (obj.pickupTime) setPickupTime(obj.pickupTime);
        if (obj.returnDate) setReturnDate(obj.returnDate);
        if (obj.returnTime) setReturnTime(obj.returnTime);
        if (obj.pickupDate && obj.pickupTime && obj.returnDate && obj.returnTime) {
          setIsConfigurationApplied(true);
        }
      } catch (e) {
        // ignore
      }
    }
  }, []);

  // Update localStorage whenever rental config changes
  useEffect(() => {
    localStorage.setItem(
      "rentalConfig",
      JSON.stringify({
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
      })
    );
    if (pickupDate && pickupTime && returnDate && returnTime) {
      setIsConfigurationApplied(true);
    } else {
      setIsConfigurationApplied(false);
    }
  }, [pickupDate, pickupTime, returnDate, returnTime]);

  // Open rental config modal automatically if coming from home or if no config set
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const openRentalConfig = params.get("openRentalConfig");
    if (
      openRentalConfig === "true" ||
      !(pickupDate && pickupTime && returnDate && returnTime)
    ) {
      setIsRentalConfigOpen(true);
    }
    // eslint-disable-next-line
  }, [location.search]);

  // Function to ensure date is in YYYY-MM-DD format
  const toISODate = (dateStr) => {
    if (!dateStr) return "";
    // If already in YYYY-MM-DD, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    // If in DD/MM/YYYY, convert
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) {
      const [d, m, y] = dateStr.split("/");
      return `${y}-${m}-${d}`;
    }
    // Otherwise, try to parse
    const d = new Date(dateStr);
    if (!isNaN(d)) {
      return d.toISOString().slice(0, 10);
    }
    return dateStr;
  };

  // --- Edited: checkProductAvailability now RETURNS availability (true/false/null)
  const checkProductAvailability = async (pickupDate, pickupTime, returnDate, returnTime) => {
    // NOTE: Loading is handled by caller for determinism
    setAvailabilityError("");
    setIsAvailable(null); // Reset before check

    const isoPickupDate = toISODate(pickupDate);
    const isoReturnDate = toISODate(returnDate);
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(isoPickupDate) || !dateRegex.test(isoReturnDate)) {
      setAvailabilityError("Please select valid dates (YYYY-MM-DD format) from the date picker.");
      setIsAvailable(null);
      return null;
    }

    try {
      if (!isoPickupDate || !pickupTime || !isoReturnDate || !returnTime) {
        setAvailabilityError("Please select all rental dates and times.");
        setIsAvailable(null);
        return null;
      }

      const res = await axios.post("/api/v1/products/check-availability", {
        productId: id,
        pickupDate: isoPickupDate,
        pickupTime,
        returnDate: isoReturnDate,
        returnTime,
      });

      if (res.data && res.data.success) {
        setIsAvailable(res.data.available);
        if (!res.data.available) {
          setAvailabilityError(
            "This product is not available for the selected dates/times. Please try a different product or period."
          );
        } else {
          setAvailabilityError("");
        }
        // <-- return the definitive boolean
        return res.data.available;
      } else {
        setIsAvailable(null);
        setAvailabilityError("Could not check availability. Please try again.");
        return null;
      }
    } catch (e) {
      setIsAvailable(null);
      setAvailabilityError("Could not check availability. Please try again.");
      return null;
    }
  };

  // Helper: Calculate rental days (minimum 1 day)
  const getRentalDays = (pickupDate, pickupTime, returnDate, returnTime) => {
    if (!pickupDate || !pickupTime || !returnDate || !returnTime) return 1;
    const start = new Date(`${pickupDate}T${pickupTime}:00+04:00`);
    const end = new Date(`${returnDate}T${returnTime}:00+04:00`);
    const ms = end - start;
    if (isNaN(ms) || ms <= 0) return 1;
    // Calculate days, round up for partial days
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  };

  // Helper: Calculate rental hours (minimum 1 hour)
  const getRentalHours = (pickupDate, pickupTime, returnDate, returnTime) => {
    if (!pickupDate || !pickupTime || !returnDate || !returnTime) return 1;
    const start = new Date(`${pickupDate}T${pickupTime}:00+04:00`);
    const end = new Date(`${returnDate}T${returnTime}:00+04:00`);
    const ms = end - start;
    if (isNaN(ms) || ms <= 0) return 1;
    // Calculate hours, round up for partial hours
    return Math.ceil(ms / (1000 * 60 * 60));
  };

  // handling Add-to-cart
  const handleAddItem = () => {
    if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
      setIsRentalConfigOpen(true);
      alert.info("Please select pickup and return date/time first.");
      return;
    }
    dispatch(addItemToCart(id, quantity, {
      rentalConfig: {
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        rentalHours,
        rentalPrice: finalPrice, // Pass the calculated price
      },
      rentalPrice: finalPrice, // Also pass at root for backend
    }));
    alert.success("Item Added To Cart");
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const handleIncreaseCartQuantity = () => {
    if (cartQuantity < product.Stock) {
      dispatch(addItemToCart(id, cartQuantity + 1));
      alert.success("Quantity increased");
    } else {
      alert.error("Cannot add more items - insufficient stock");
    }
  };

  const handleDecreaseCartQuantity = () => {
    if (cartQuantity > 1) {
      const newQuantity = cartQuantity - 1;
      dispatch(addItemToCart(id, newQuantity));
      alert.success("Quantity decreased");
    } else {
      dispatch(removeItemFromCart(id));
      alert.success("Item removed from cart");
    }
  };

  // handling Preview image
  const handlePreviewImg = (images, i) => {
    setPreviewImg(images[i].url);
    handleActive(i);
  };

  function increaseQuantityHandler() {
    if (!product || product.Stock <= quantity) {
      return;
    }
    setQuantity((prv) => prv + 1);
  }

  function deceraseQuantityHandler() {
    if (quantity <= 1) {
      return;
    }
    setQuantity((prv) => prv - 1);
  }

  // Defensive checks for product and price
  const rentalPricing = product?.rentalPricing || {};
  const firstHourPrice = rentalPricing.firstHourPrice ?? product?.price ?? 0;
  const subsequentHourPrice = rentalPricing.subsequentHourPrice ?? firstHourPrice;

  const rentalHours = getRentalHours(pickupDate, pickupTime, returnDate, returnTime);
  let rentalPrice = 0;
  if (rentalHours <= 1) {
    rentalPrice = firstHourPrice;
  } else {
    rentalPrice = firstHourPrice + (rentalHours - 1) * subsequentHourPrice;
  }
  // Remove discount logic: just use rentalPrice as the final price
  const finalPrice = rentalPrice;
  const newPrice = dispalyMoney(finalPrice);

  // Helper for compact display
  const formatDubaiCompact = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "";
    try {
      const dt = new Date(`${dateStr}T${timeStr}:00+04:00`);
      return dt.toLocaleString("en-GB", {
        timeZone: "Asia/Dubai",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return `${dateStr} ${timeStr}`;
    }
  };
  const getCompactDisplayText = () => {
    if (!isConfigurationApplied) {
      return "Click to set rental dates & times";
    }
    return `${formatDubaiCompact(pickupDate, pickupTime)} → ${formatDubaiCompact(returnDate, returnTime)}`;
  };

  // --- Edited: make handler async, await the returned availability rather than reading stale state
  const handleApplyRentalConfig = async () => {
    if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
      alert.error("Please select pickup and return date and time");
      return;
    }
    const pickup = new Date(`${pickupDate}T${pickupTime}:00+04:00`);
    const ret = new Date(`${returnDate}T${returnTime}:00+04:00`);
    if (pickup >= ret) {
      alert.error("Return time must be after pickup time");
      return;
    }

    setAvailabilityLoading(true);
    const available = await checkProductAvailability(pickupDate, pickupTime, returnDate, returnTime);
    setAvailabilityLoading(false);

    // Use the returned value to decide — don't rely on immediate state update
    if (available === true) {
      setIsConfigurationApplied(true);
      setIsRentalConfigOpen(false);
      alert.success("Rental configuration applied!");
    } else if (available === false) {
      // already sets availabilityError inside checkProductAvailability
      alert.error("Product is not available for selected dates/times.");
    } else {
      alert.error("Could not check availability. Please try again.");
    }
  };

  // Prevent background scroll when rental config modal is open (CSS fallback)
  useEffect(() => {
    if (isRentalConfigOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isRentalConfigOpen]);

  return (
    <>
      {loading ? (
        <CricketBallLoader />
      ) : !product ? (
        <div className="prodcutDetialsContainer">
          <MetaData title="Product Not Found" />
          <h2 style={{ color: "#fff" }}>Product not found or failed to load.</h2>
        </div>
      ) : (
        <>
          <div className="prodcutDetialsContainer">
            <MetaData title={product.name} />
            <section id="product_details" className="section">
              <div className="product_container">
                <div className="wrapper prod_details_wrapper">
                  {/*=== Product Details Left-content ===*/}
                  <div className="prod_details_left_col">
                    <div className="prod_details_tabs">
                      {product.images &&
                        product.images.map((img, i) => (
                          <div
                            key={i}
                            className={`tabs_item ${activeClass(i)}`}
                            onClick={() => handlePreviewImg(product.images, i)}
                          >
                            <img src={img.url} alt="product-img" />
                          </div>
                        ))}
                    </div>
                    <figure className="prod_details_img">
                      <img src={previewImg || (product.images && product.images[0]?.url)} alt="product-img" />
                    </figure>
                  </div>

                  {/*=== Product Details Right-content ===*/}
                  <div className="prod_details_right_col_001" style={{ color: "#f3f4f6", background: "#181c24" }}>
                    <h1 className="prod_details_title" style={{ color: "#f3f4f6" }}>{product.name}</h1>
                    <h4 className="prod_details_info" style={{ color: "#cbd5e1" }}>
                      {product.info && product.info}
                    </h4>

                    <div className="prod_details_ratings" style={{ color: "#f3f4f6" }}>
                      <Rating
                        value={product.ratings}
                        precision={0.5}
                        readOnly
                        style={{ color: "#fbbf24", fontSize: 20 }}
                      />
                      <span style={{ color: "#cbd5e1" }}>|</span>
                      <Link
                        to="#"
                        style={{ textDecoration: "none", color: "#60a5fa" }}
                      >
                        {product.numOfReviews} Ratings
                      </Link>
                    </div>

                    {/* Rental Configuration Bar */}
                    <div className="rental-compact-bar" style={{ margin: "18px 0" }}>
                      <Button
                        variant="contained"
                        onClick={() => setIsRentalConfigOpen(true)}
                        className="compact-rental-button"
                        startIcon={
                          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40 }}>
                            <CalendarTodayIcon style={{ width: 32, height: 32, color: "#38bdf8" }} />
                          </span>
                        }
                        style={{
                          background: isConfigurationApplied
                            ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                            : "#23272f",
                          color: "#f3f4f6",
                          border: "1px solid #334155",
                          boxShadow: "0 2px 12px #33415544"
                        }}
                      >
                        <div className="compact-rental-text" style={{ textTransform: "none", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                          <span className="duration-label" style={{ fontWeight: 700, color: "#f3f4f6" }}>
                            {isConfigurationApplied ? `Rental - ACTIVE` : "Set Rental Dates & Times"}
                          </span>
                          <span className="date-time-display" style={{ fontSize: 13, color: "#cbd5e1" }}>
                            {getCompactDisplayText()}
                          </span>
                        </div>
                      </Button>
                    </div>

                    {/* Rental Configuration Modal */}
                    <Modal
                      open={isRentalConfigOpen}
                      onClose={() => setIsRentalConfigOpen(false)}
                      closeAfterTransition
                      BackdropComponent={Backdrop}
                      BackdropProps={{
                        timeout: 500,
                        style: { backgroundColor: "rgba(0, 0, 0, 0.6)" },
                      }}
                    >
                      <Fade in={isRentalConfigOpen}>
                        <div className="rental-modal">
                          <div className="rental-modal-card" style={{ background: "#23272f", borderRadius: 12, padding: 24, maxWidth: 480, margin: "60px auto", color: "#f3f4f6" }}>
                            <div className="modal-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                              <Typography variant="h5" style={{ display: "flex", alignItems: "center", gap: 10, color: "#f3f4f6" }}>
                                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 40, height: 40 }}>
                                  <CalendarTodayIcon style={{ width: 40, height: 40, color: "#38bdf8" }} />
                                </span>
                                Configure Your Rental
                              </Typography>
                              <IconButton onClick={() => setIsRentalConfigOpen(false)}>
                                <CloseIcon style={{ color: "#cbd5e1", fontSize: 40 }} /> {/* Increased size */}
                              </IconButton>
                            </div>
                            <Grid container spacing={3} className="rental-form" style={{ marginTop: 8 }}>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body1" className="field-label" style={{ color: "#f3f4f6" }}>Pickup Date *</Typography>
                                <Input
                                  type="date"
                                  fullWidth
                                  value={pickupDate}
                                  onChange={(e) => setPickupDate(e.target.value)}
                                  inputProps={{ min: new Date().toISOString().split("T")[0] }}
                                  style={{ width: "100%", color: "#f3f4f6", background: "#1e293b", borderRadius: 6, border: "1px solid #334155" }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body1" className="field-label" style={{ color: "#f3f4f6" }}>Pickup Time *</Typography>
                                <select
                                  value={pickupTime}
                                  onChange={(e) => setPickupTime(e.target.value)}
                                  style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #334155", background: "#1e293b", color: "#f3f4f6" }}
                                >
                                  <option value="">Select time</option>
                                  {timeOptions.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body1" className="field-label" style={{ color: "#f3f4f6" }}>Return Date *</Typography>
                                <Input
                                  type="date"
                                  fullWidth
                                  value={returnDate}
                                  onChange={(e) => setReturnDate(e.target.value)}
                                  inputProps={{ min: pickupDate || new Date().toISOString().split("T")[0] }}
                                  style={{ width: "100%", color: "#f3f4f6", background: "#1e293b", borderRadius: 6, border: "1px solid #334155" }}
                                />
                              </Grid>
                              <Grid item xs={12} md={6}>
                                <Typography variant="body1" className="field-label" style={{ color: "#f3f4f6" }}>Return Time *</Typography>
                                <select
                                  value={returnTime}
                                  onChange={(e) => setReturnTime(e.target.value)}
                                  style={{ width: "100%", padding: "8px", borderRadius: 6, border: "1px solid #334155", background: "#1e293b", color: "#f3f4f6" }}
                                >
                                  <option value="">Select time</option>
                                  {timeOptions.map((t) => (
                                    <option key={t} value={t}>{t}</option>
                                  ))}
                                </select>
                              </Grid>
                              <Grid item xs={12}>
                                <Button
                                  variant="contained"
                                  fullWidth
                                  onClick={handleApplyRentalConfig}
                                  className="apply-rental-button"
                                  size="large"
                                  startIcon={<AccessTimeIcon style={{ fontSize: 28 }} />}
                                  style={{ background: "linear-gradient(135deg, #3b82f6 0%, #ef4444 100%)", color: "#fff" }}
                                  disabled={availabilityLoading}
                                >
                                  {availabilityLoading ? "Checking Availability..." : "Apply Rental Configuration"}
                                </Button>
                              </Grid>
                              {availabilityError && (
                                <Grid item xs={12}>
                                  <Typography style={{ color: "#ef4444", marginTop: 8, fontWeight: 600 }}>
                                    {availabilityError}
                                  </Typography>
                                </Grid>
                              )}
                            </Grid>
                          </div>
                        </div>
                      </Fade>
                    </Modal>

                    <div className="prod_details_price">
                      <div className="price_box">
                        <h2 className="price" style={{ color: "#f3f4f6" }}>
                          {availabilityLoading ? (
                            <span style={{ color: "#60a5fa" }}>Checking availability...</span>
                          ) : isConfigurationApplied ? (
                            isAvailable === false ? (
                              <span style={{ color: "#ef4444", fontWeight: 600 }}>
                                Not available for selected dates/times
                              </span>
                            ) : isAvailable === true ? (
                              <>
                                {newPrice}
                                {/* Removed old price and discount display */}
                              </>
                            ) : (
                              <span style={{ color: "#64748b", fontWeight: 400 }}>Select rental dates & times to view price</span>
                            )
                          ) : (
                            <span style={{ color: "#64748b", fontWeight: 400 }}>Select rental dates & times to view price</span>
                          )}
                        </h2>
                        {/* Removed savings/discount display */}
                        <span className="tax_txt" style={{ color: "#cbd5e1" }}>
                          (Inclusive of all taxes)
                        </span>
                      </div>
                      <div className="badge">
                        {product.Stock >= 1 ? (
                          <span className="instock">
                            <DoneIcon /> In Stock
                          </span>
                        ) : (
                          <span className="outofstock">
                            <CloseIcon />
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="seprator2"></div>

                    <div className="productDescription">
                      <div className="productDiscriptiopn_text" style={{ color: "#cbd5e1" }}>
                        <h4 style={{ color: "#f3f4f6" }}>Descripition :</h4>
                        <p style={{ color: "#cbd5e1" }}>{product.description}</p>
                      </div>
                      <div className="deliveryText" style={{ color: "#60a5fa" }}>
                        <LocalShippingOutlinedIcon style={{ color: "#38bdf8" }} />
                        We deliver! Just say when and how.
                      </div>
                    </div>
                    <div className="seprator2"></div>

                    <div className="prod_details_additem">
                      <h5 style={{ color: "#f3f4f6" }}>QTY :</h5>
                      {isAvailable === false ? (
                        <Typography style={{ color: "#ef4444", fontWeight: 600, marginTop: 12 }}>
                          Not available for selected dates/times
                        </Typography>
                      ) : !isInCart ? (
                        <>
                          <div className="additem">
                            <IconButton
                              onClick={deceraseQuantityHandler}
                              className="additem_decrease"
                              size="small"
                              style={{ color: "#fff", background: "#1e293b", borderRadius: 6, minWidth: 32, minHeight: 32 }}
                            >
                              <RemoveIcon fontSize="medium" />
                            </IconButton>
                            <Input
                              readOnly
                              type="number"
                              value={quantity}
                              className="input"
                              inputProps={{
                                style: {
                                  width: 48, // increased from 28
                                  fontSize: "1.25rem", // slightly larger
                                  fontWeight: 600,
                                  textAlign: "center",
                                  color: "#f3f4f6",
                                  background: "#23272f",
                                  borderRadius: 6,
                                  padding: "2px 4px",
                                  height: 36, // slightly taller
                                }
                              }}
                              style={{
                                width: 56, // increased from 32
                                minWidth: 0,
                                color: "#f3f4f6",
                                background: "#23272f",
                                borderRadius: 6,
                                margin: "0 4px",
                                height: 40, // slightly taller
                              }}
                            />
                            <IconButton
                              onClick={increaseQuantityHandler}
                              className="additem_increase"
                              size="small"
                              style={{ color: "#fff", background: "#1e293b", borderRadius: 6, minWidth: 32, minHeight: 32 }}
                              disabled={quantity >= product.Stock}
                            >
                              <AddIcon fontSize="large" style={{ fontSize: 32 }} /> {/* Make only the + icon larger */}
                            </IconButton>
                          </div>
                          <Button
                            variant="contained"
                            className="prod_details_addtocart_btn"
                            style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                            onClick={handleAddItem}
                            disabled={isAvailable === false || product.Stock < 1}
                          >
                            Add To Cart
                          </Button>
                        </>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                          <div className="additem">
                            <IconButton
                              onClick={handleDecreaseCartQuantity}
                              className="additem_decrease"
                              size="small"
                              style={{ color: "#fff", background: "#1e293b", borderRadius: 6, minWidth: 32, minHeight: 32 }}
                            >
                              <RemoveIcon fontSize="medium" />
                            </IconButton>
                            <Input
                              readOnly
                              type="number"
                              value={cartQuantity}
                              className="input"
                              inputProps={{
                                style: {
                                  width: 48, // increased from 28
                                  fontSize: "1.25rem", // slightly larger
                                  fontWeight: 600,
                                  textAlign: "center",
                                  color: "#f3f4f6",
                                  background: "#23272f",
                                  borderRadius: 6,
                                  padding: "2px 4px",
                                  height: 36, // slightly taller
                                }
                              }}
                              style={{
                                width: 56, // increased from 32
                                minWidth: 0,
                                color: "#f3f4f6",
                                background: "#23272f",
                                borderRadius: 6,
                                margin: "0 4px",
                                height: 40, // slightly taller
                              }}
                            />
                            <IconButton
                              onClick={handleIncreaseCartQuantity}
                              className="additem_increase"
                              size="small"
                              style={{ color: "#fff", background: "#1e293b", borderRadius: 6, minWidth: 32, minHeight: 32 }}
                              disabled={cartQuantity >= product.Stock}
                            >
                              <AddIcon fontSize="large" style={{ fontSize: 32 }} /> {/* Make only the + icon larger */}
                            </IconButton>
                          </div>
                          <Button
                            variant="contained"
                            className="prod_details_addtocart_btn"
                            style={{ backgroundColor: "#4CAF50", color: "#fff" }}
                            disabled
                          >
                            In Cart ({cartQuantity})
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <div
              className="reviewCard"
              style={{
                background: "rgba(30,41,59,0.85)",
                color: "#e0e7ef",
                borderRadius: 18,
                margin: "2.5rem 0",
                padding: "2rem 1.5rem",
                boxShadow: "0 8px 32px 0 rgba(59,130,246,0.25)",
                border: "1.5px solid rgba(59,130,246,0.18)",
                maxWidth: 950,
                marginLeft: "auto",
                marginRight: "auto",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Typography
                variant="h5"
                style={{
                  color: "#bae6fd",
                  fontWeight: 800,
                  marginBottom: "1.2rem",
                  letterSpacing: "0.5px",
                  textAlign: "left",
                  textShadow: "0 2px 12px #0ea5e9a0",
                  fontSize: "2rem",
                }}
              >
                Customer Reviews
              </Typography>
              <ReviewCard product={product} />
            </div>
          </div>

          <CartNotification
            open={showNotification}
            onClose={() => setShowNotification(false)}
            productName={product.name}
          />
        </>
      )}
    </>
  );
};

export default ProductDetails;
