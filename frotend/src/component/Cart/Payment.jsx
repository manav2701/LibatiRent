// PaymentComponent.jsx
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import MetaData from "../layouts/MataData/MataData";
import { useAlert } from "react-alert";
import axios from "axios";
import { useHistory, Link as RouterLink } from "react-router-dom";
import OrderDetailsSection from "./OrderDetails";
import DummyCard from "./DummyCard";
import { clearErrors, createOrder } from "../../actions/orderAction";
import CheckoutSteps from "./CheckoutSteps ";

// Stripe Elements
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

import "./Cart.css"; // keep your css file (you can enhance it later)

import {
  Typography,
  TextField,
  Grid,
  Radio,
  Button,
  Divider,
  Link,
  Box,
  Paper,
  IconButton,
} from "@material-ui/core";

import {
  CreditCard,
  CardMembership,
  Payment,
  Lock,
  LocalShipping,
} from "@material-ui/icons";

import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";
import AssuredWorkloadOutlinedIcon from "@mui/icons-material/AssuredWorkloadOutlined";

import { ReactComponent as MasterCard } from "../../Image/payment-svg/mastercard.svg";
import { ReactComponent as Visa } from "../../Image/payment-svg/visa (1).svg";
import { ReactComponent as Paytm } from "../../Image/payment-svg/paytm.svg";

import {
  dispalyMoney,
  generateDiscountedPrice,
} from "../DisplayMoney/DisplayMoney";

const useStyles = makeStyles((theme) => ({
  payemntPage: {
    minHeight: "100vh",
    width: "100%",
    padding: theme.spacing(4),
    margin: 0,
    background: "linear-gradient(135deg, #181A20 0%, #23262F 100%)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    boxSizing: "border-box",
  },
  container: {
    width: "100%",
    maxWidth: 1200,
    display: "flex",
    gap: theme.spacing(3),
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column-reverse",
      padding: theme.spacing(1),
    },
  },
  leftPanel: {
    flex: 1.2,
    minWidth: 320,
    background: "rgba(24, 26, 32, 0.85)",
    borderRadius: 16,
    padding: theme.spacing(3),
    border: "1.5px solid rgba(59,130,246,0.12)",
    color: "#fff",
    boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
  },
  rightPanel: {
    flex: 0.6,
    minWidth: 280,
    background: "rgba(35,38,47,0.85)",
    borderRadius: 16,
    padding: theme.spacing(3),
    border: "1px solid rgba(59,130,246,0.08)",
    color: "#fff",
    height: "fit-content",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  PaymentHeading: {
    fontWeight: 800,
    marginBottom: theme.spacing(1.5),
    fontSize: "1.6rem",
    textTransform: "uppercase",
    color: "#bae6fd",
    letterSpacing: "1px",
  },
  securePayemnt: {
    display: "flex",
    alignItems: "center",
    gap: theme.spacing(1),
    fontWeight: 300,
    background: "rgba(59,130,246,0.06)",
    padding: theme.spacing(1),
    borderRadius: 10,
    color: "#bae6fd",
    marginBottom: theme.spacing(2),
  },
  cardContainer: {
    padding: theme.spacing(2),
    border: "1px solid rgba(59,130,246,0.08)",
    borderRadius: 12,
    background: "rgba(35,38,47,0.6)",
    marginBottom: theme.spacing(2),
  },
  labelText: {
    fontWeight: 300,
    color: "#BDE7FF",
    marginBottom: theme.spacing(0.5),
  },
  paymentInput: {
    width: "100%",
    padding: "12px 14px",
    border: "1px solid #4F8CFF",
    background: "rgba(35,38,47,0.85)",
    color: "#fff",
    borderRadius: 8,
    fontSize: "0.95rem",
  },
  iconsRow: {
    display: "flex",
    gap: theme.spacing(1),
    alignItems: "center",
    marginTop: theme.spacing(1.5),
    marginBottom: theme.spacing(1),
    "& svg": {
      height: 28,
      width: "auto",
      opacity: 0.95,
    },
  },
  placeOrderBtn: {
    marginTop: theme.spacing(3),
    background: "linear-gradient(135deg, #4F8CFF 0%, #1E2746 100%)",
    color: "#fff",
    fontWeight: 600,
    padding: theme.spacing(1.2),
    borderRadius: 10,
    "&:hover": {
      background: "linear-gradient(135deg, #1E2746 0%, #4F8CFF 100%)",
    },
  },
  smallText: {
    color: "#B0B3B8",
    fontSize: "0.9rem",
  },
  orderSummaryHeading: {
    color: "#bae6fd",
    marginBottom: theme.spacing(1),
    fontWeight: 700,
  },
  orderItemRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(0.8),
  },
  couponRow: {
    display: "flex",
    gap: theme.spacing(1),
    marginTop: theme.spacing(2),
    alignItems: "center",
  },
  shippingBlock: {
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(1),
    borderTop: "1px solid rgba(255,255,255,0.03)",
  },
  editIcon: {
    cursor: "pointer",
    color: "#bae6fd",
  },
  linkNoUnderline: {
    textDecoration: "none",
    color: "inherit",
  },
  centerText: {
    textAlign: "center",
  },
  paymentUnavailableBox: {
    padding: theme.spacing(4),
    textAlign: "center",
    color: "#ffb4b4",
  },
}));

const TAX_RATE = 0.05; // 5% VAT, adjust as needed

function calculateRentalPrice(item) {
  // If item has rentalConfig and rentalPricing
  const rental = item.rentalConfig || {};
  const pricing = item.rentalPricing || {};
  if (
    rental.pickupDate &&
    rental.pickupTime &&
    rental.returnDate &&
    rental.returnTime &&
    pricing.firstHourPrice !== undefined &&
    pricing.subsequentHourPrice !== undefined
  ) {
    const pickup = new Date(`${rental.pickupDate}T${rental.pickupTime}:00+04:00`);
    const ret = new Date(`${rental.returnDate}T${rental.returnTime}:00+04:00`);
    let hours = Math.ceil((ret - pickup) / (1000 * 60 * 60));
    hours = Math.max(1, hours);
    if (hours === 1) return pricing.firstHourPrice;
    return pricing.firstHourPrice + pricing.subsequentHourPrice * (hours - 1);
  }
  // Fallback to item.price if no rental config
  return item.price;
}

const PaymentComponent = (props) => {
  const classes = useStyles();
  const history = useHistory();
  const alert = useAlert();
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();

  // redux state
  const { shippingInfo = {}, cartItems = [] } = useSelector((state) => state.cart || {});
  const { error } = useSelector((state) => state.newOrder || {});
  // user from session (fall back to empty object safely)
  const user = (() => {
    try {
      return JSON.parse(sessionStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  })();

  // local UI state
  const [isFocused, setIsFocused] = useState(false);
  const [nameOnCard, setNameOnCard] = useState(user.name || "");
  const [couponCode, setCouponCode] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [showDummyCard, setShowDummyCard] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate total price based on rental config and pricing for each cart item
  const cartTotals = cartItems.map(item => {
    const rentalPrice = calculateRentalPrice(item);
    return {
      ...item,
      rentalPrice,
      total: rentalPrice * item.quantity,
    };
  });

  // Sum up all item totals
  let itemsTotal = cartTotals.reduce((acc, curr) => acc + curr.total, 0);

  // Add taxes (if any)
  let taxAmount = itemsTotal * TAX_RATE;
  let totalFinalPrice = itemsTotal + taxAmount;

  // Format for display
  let displayItemsTotal = dispalyMoney(itemsTotal);
  let displayTaxAmount = dispalyMoney(taxAmount);
  let displayTotalFinalPrice = dispalyMoney(totalFinalPrice);

  // Payment data for Stripe
  const paymentData = {
    amount: Math.round(totalFinalPrice * 100), // Stripe expects amount in cents/paisa
  };

  // order skeleton
  const order = {
    shippingInfo,
    orderItems: cartTotals, // include rentalPrice for each item
    itemsPrice: itemsTotal,
    taxPrice: taxAmount,
    shippingPrice: 0,
    totalPrice: totalFinalPrice,
  };

  // coupon / UI handlers
  const handleNameOnCardChange = (e) => setNameOnCard(e.target.value);
  const handleApplyCoupon = () => {
    // placeholder coupon logic - expand with your API
    if (!couponCode.trim()) {
      setIsValid(false);
      return;
    }
    // for demo just treat as invalid
    setIsValid(false);
    alert.show("Coupon processing not implemented (demo).");
  };
  const handleFocus = (e) => setIsFocused(true);

  const handleRadioChange = () => setShowDummyCard((s) => !s);
  const handleCloseDummyCard = () => setShowDummyCard(false);

  // Payment submit
  async function paymentSubmitHandler(e) {
    e.preventDefault();
    if (!nameOnCard || nameOnCard.trim() === "") {
      alert.error("Please enter name on card");
      return;
    }

    // safety: check required state
    if (!shippingInfo || !shippingInfo.address) {
      alert.error("Please provide a shipping address before payment.");
      history.push("/shipping");
      return;
    }

    if (!stripe || !elements) {
      alert.error("Payment system not ready. Please try again later.");
      return;
    }

    setIsProcessing(true);

    try {
      const config = {
        headers: { "Content-Type": "application/json" },
      };
      const { data } = await axios.post("/api/v1/payment/process", paymentData, config);

      const client_secret = data?.client_secret;
      if (!client_secret) {
        throw new Error("Payment initialization failed. Missing client secret.");
      }

      // Confirm card payment with Stripe
      const result = await stripe.confirmCardPayment(client_secret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: nameOnCard || user.name || "Card Holder",
            email: user.email,
            address: {
              line1: shippingInfo.address,
              city: shippingInfo.city,
              state: shippingInfo.state,
              postal_code: shippingInfo.pinCode,
              country: "IN",
            },
          },
        },
      });

      if (result.error) {
        alert.error(result.error.message || "Payment failed.");
        setIsProcessing(false);
      } else if (result.paymentIntent && result.paymentIntent.status === "succeeded") {
        order.paymentInfo = {
          id: result.paymentIntent.id,
          status: result.paymentIntent.status,
        };

        dispatch(createOrder(order));
        alert.success("Payment succeeded!");
        history.push("/success");
      } else {
        alert.error("There was an issue processing your payment. Please try again.");
        setIsProcessing(false);
      }
    } catch (err) {
      // give meaningful error
      const message = err?.response?.data?.message || err.message || "Payment error";
      alert.error(message);
      setIsProcessing(false);
    }
  }

  // handle redux errors
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
  }, [dispatch, alert, error]);

  // discount calculations using your helpers
  let totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  let discountedPrice = generateDiscountedPrice(totalPrice);
  let totalDiscount = totalPrice - discountedPrice;
  let final = totalPrice - totalDiscount;

  // Format for display (your helper)
  try {
    final = dispalyMoney(final);
    totalDiscount = dispalyMoney(totalDiscount);
    totalPrice = dispalyMoney(totalPrice);
  } catch {
    // fallback if helpers missing
    final = `₹${(final || 0).toFixed(2)}`;
    totalDiscount = `₹${(totalDiscount || 0).toFixed(2)}`;
    totalPrice = `₹${(totalPrice || 0).toFixed(2)}`;
  }

  // Render fallback if stripe unavailable (prop passed from parent/App)
  if (props.stripeUnavailable) {
    return (
      <div className={classes.paymentUnavailableBox}>
        <MetaData title="Payment Unavailable" />
        <Typography variant="h5" gutterBottom>
          Payment system is currently unavailable
        </Typography>
        <Typography className={classes.smallText}>
          We are unable to process payments right now. Please try again later or contact support.
        </Typography>
      </div>
    );
  }

  const address = shippingInfo
    ? `${shippingInfo.address || ""}, ${shippingInfo.city || ""} ${shippingInfo.state || ""}, ${shippingInfo.pinCode || ""}, ${shippingInfo.country || "India"}`
    : "No address";

  return (
    <>
      <div className={classes.payemntPage}>
        <MetaData title={"Payment"} />
        <div className={classes.container}>
          {/* Left: Payment form */}
          <Paper elevation={0} className={classes.leftPanel}>
            <CheckoutSteps activeStep={2} />
            <Typography className={classes.PaymentHeading}>Payment Method</Typography>

            <div className={classes.securePayemnt}>
              <AssuredWorkloadOutlinedIcon />
              <Typography className={classes.smallText}>
                Payments are SSL encrypted — your card details stay safe.
              </Typography>
            </div>

            <div className={classes.cardContainer}>
              <Typography className={classes.labelText}>Card number</Typography>
              <div style={{ position: "relative" }}>
                <CardMembership style={{ position: "absolute", top: 12, right: 12, color: "#4F8CFF" }} />
                <div style={{ marginTop: 4 }}>
                  <CardNumberElement options={{ style: { base: { fontSize: "16px", color: "#fff" } } }} className={classes.paymentInput} />
                </div>
              </div>

              <div className={classes.iconsRow}>
                <MasterCard />
                <Visa />
                <Paytm />
              </div>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography className={classes.labelText}>Expiry date</Typography>
                  <div>
                    <Payment style={{ position: "absolute", marginTop: -34, marginLeft: -6, color: "#4F8CFF" }} />
                    <div style={{ marginTop: 8 }}>
                      <CardExpiryElement options={{ style: { base: { fontSize: "15px", color: "#fff" } } }} className={classes.paymentInput} />
                    </div>
                  </div>
                </Grid>

                <Grid item xs={6}>
                  <Typography className={classes.labelText}>CVV</Typography>
                  <div>
                    <Lock style={{ position: "absolute", marginTop: -34, marginLeft: -6, color: "#4F8CFF" }} />
                    <div style={{ marginTop: 8 }}>
                      <CardCvcElement options={{ style: { base: { fontSize: "15px", color: "#fff" } } }} className={classes.paymentInput} />
                    </div>
                  </div>
                </Grid>

                <Grid item xs={12}>
                  <Typography className={classes.labelText}>Name on card</Typography>
                  <TextField
                    placeholder="John Doe"
                    variant="outlined"
                    fullWidth
                    className={classes.paymentInput}
                    value={nameOnCard}
                    required
                    onChange={handleNameOnCardChange}
                    InputProps={{ style: { background: "transparent", color: "#fff" } }}
                  />
                </Grid>
              </Grid>
            </div>

            <Box display="flex" alignItems="center" mt={1}>
              <Radio checked={showDummyCard} onChange={handleRadioChange} color="primary" />
              <Typography style={{ color: "#bae6fd", cursor: "pointer" }}>Use dummy card</Typography>
              <Box ml={1}>
                <CreditCard />
              </Box>
              {showDummyCard && <DummyCard onClose={handleCloseDummyCard} />}
            </Box>

            <Typography className={classes.smallText} style={{ marginTop: 14 }}>
              By clicking "Place Order", you agree to our{" "}
              <Link component={RouterLink} to="/terms/conditions" style={{ color: "#bae6fd" }}>
                Terms & Conditions
              </Link>
            </Typography>

            <Button
              variant="contained"
              fullWidth
              className={classes.placeOrderBtn}
              onClick={paymentSubmitHandler}
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : `Place Order • ${displayTotalFinalPrice}`}
            </Button>
          </Paper>

          {/* Right: Order summary */}
          <Paper elevation={0} className={classes.rightPanel}>
            <Typography className={classes.orderSummaryHeading} variant="h6">
              Order Summary ({cartItems.length} {cartItems.length > 1 ? "items" : "item"})
            </Typography>

            <Divider style={{ background: "rgba(255,255,255,0.04)", marginBottom: 12 }} />

            <div className={classes.orderItemRow}>
              <Typography className={classes.smallText}>Subtotal</Typography>
              <Typography>{displayItemsTotal}</Typography>
            </div>

            <div className={classes.orderItemRow}>
              <Typography className={classes.smallText}>Tax (5% VAT)</Typography>
              <Typography>{displayTaxAmount}</Typography>
            </div>

            <div className={classes.orderItemRow}>
              <Typography className={classes.smallText}>Delivery</Typography>
              <Typography><b>Free</b></Typography>
            </div>

            <Divider style={{ background: "rgba(255,255,255,0.03)", margin: "10px 0" }} />

            <div className={classes.orderItemRow}>
              <div>
                <Typography variant="subtitle1">Total</Typography>
                <Typography style={{ fontSize: 12, color: "#9aa0a6" }}>(Inclusive of taxes)</Typography>
              </div>
              <Typography variant="h6">{displayTotalFinalPrice}</Typography>
            </div>

            <div className={classes.couponRow}>
              <TextField
                label="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                onFocus={handleFocus}
                error={!isValid}
                helperText={!isValid ? "Invalid coupon code" : ""}
                variant="outlined"
                size="small"
                style={{ background: "rgba(0,0,0,0.25)" }}
                InputProps={{ style: { color: "#fff" } }}
              />
              <Button variant="contained" color="primary" onClick={handleApplyCoupon}>
                Apply
              </Button>
            </div>

            <Box mt={2} className={classes.centerText}>
              <img src={require("../../Image/cart/cart_img.png")} alt="payment-icons" style={{ maxWidth: "100%" }} />
            </Box>

            <Box className={classes.shippingBlock}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" className={classes.orderSummaryHeading}>
                  Delivery Address
                </Typography>
                <IconButton size="small" onClick={() => history.push("/shipping")}>
                  <EditIcon style={{ color: "#bae6fd" }} />
                </IconButton>
              </Box>

              <Typography style={{ marginTop: 8 }}>{user.name}</Typography>
              <Typography style={{ marginTop: 6 }}>{address}</Typography>
              <Typography style={{ marginTop: 6 }}>{shippingInfo.phoneNo}</Typography>
              <Typography style={{ marginTop: 6 }}>{user.email}</Typography>
            </Box>

            <Box className={classes.shippingBlock}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" className={classes.orderSummaryHeading}>
                  Billing Details
                </Typography>
                <IconButton size="small" onClick={() => history.push("/shipping")}>
                  <EditIcon style={{ color: "#bae6fd" }} />
                </IconButton>
              </Box>

              <Typography style={{ marginTop: 8 }}>{user.name}</Typography>
              <Typography style={{ marginTop: 6 }}>{address}</Typography>
              <Typography style={{ marginTop: 6 }}>{shippingInfo.phoneNo}</Typography>
              <Typography style={{ marginTop: 6 }}>{user.email}</Typography>
            </Box>

            <Divider style={{ background: "rgba(255,255,255,0.03)", margin: "12px 0" }} />

            <Typography variant="subtitle1" className={classes.orderSummaryHeading}>
              Items
            </Typography>
            <div>
              {cartTotals && cartTotals.length ? (
                cartTotals.map((item) => (
                  <RouterLink key={item.productId} to={`/product/${item.productId}`} className={classes.linkNoUnderline}>
                    <OrderDetailsSection item={item} totalDiscount={totalDiscount} totalPrice={displayItemsTotal} />
                    <Typography className={classes.smallText}>
                      {item.rentalPrice ? `Rental: ${dispalyMoney(item.rentalPrice)} × ${item.quantity}` : ""}
                    </Typography>
                    <Divider style={{ background: "rgba(255,255,255,0.02)", margin: "8px 0" }} />
                  </RouterLink>
                ))
              ) : (
                <Typography className={classes.smallText}>No items in cart</Typography>
              )}
            </div>
          </Paper>
        </div>
      </div>
    </>
  );
};

export default PaymentComponent;
