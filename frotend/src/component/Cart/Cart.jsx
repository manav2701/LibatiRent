import React, { useState } from "react";
import "./Cart.css";
import TextField from "@material-ui/core/TextField";
import { useSelector, useDispatch } from "react-redux";
import { addItemToCart, removeItemFromCart } from "../../actions/cartAction";
import { Typography } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import RemoveShoppingCartIcon from "@material-ui/icons/RemoveShoppingCart";
import { Link } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
// import { useNavigate } from "react-router-dom";
import { useHistory } from "react-router-dom";
import CartItem from "./CartItem";
import {
  dispalyMoney,
  // generateDiscountedPrice, // Remove this import, not needed
} from "../DisplayMoney/DisplayMoney";
const Cart = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { cartItems } = useSelector((state) => state.cart);

  // new code
  const [couponCode, setCouponCode] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  // new code end

  const increaseQuantity = (id, quantity, stock) => {
    const newQty = quantity + 1;
    if (stock <= quantity) {
      return;
    } else {
      // Always pass the full item object, not just rentalConfig
      const item = cartItems.find((i) => i.productId === id);
      // Pass all details to addItemToCart to preserve rentalConfig and pricing
      dispatch(addItemToCart(id, newQty, item && item.rentalConfig, item && item.rentalPricing, item && item.price));
    }
  };

  const decreaseQuantity = (id, quantity) => {
    const newQty = quantity - 1;
    if (1 >= quantity) {
      return;
    }
    const item = cartItems.find((i) => i.productId === id);
    dispatch(addItemToCart(id, newQty, item && item.rentalConfig, item && item.rentalPricing, item && item.price));
  };

  // new code
  const handleApplyCoupon = () => {
    // handle apply coupon logic
    setIsValid(false);
  };

  const handleFocus = (event) => {
    setIsFocused(event.target.value !== "");
  };

  // new code end

  const deleteCartItems = (id) => {
    dispatch(removeItemFromCart(id));
  };

  const checkoutHandler = () => {
   
    history.push("/login?redirect=/shipping");
  };

  // claculte price after discount
  // Calculate total using rentalPricing and rental duration (hours) for each item
  let totalPrice = cartItems.reduce((acc, item) => {
    // Rental config and pricing
    const rental = item.rentalConfig || {};
    let rentalHours = 1;
    if (rental.pickupDate && rental.pickupTime && rental.returnDate && rental.returnTime) {
      const pickup = new Date(`${rental.pickupDate}T${rental.pickupTime}:00+04:00`);
      const returnTime = new Date(`${rental.returnDate}T${rental.returnTime}:00+04:00`);
      const diffMs = returnTime - pickup;
      rentalHours = Math.ceil(diffMs / (1000 * 60 * 60));
      rentalHours = Math.max(1, rentalHours);
    }
    let rentalPrice = 0;
    if (item.rentalPricing) {
      if (rentalHours <= 1) {
        rentalPrice = item.rentalPricing.firstHourPrice;
      } else {
        rentalPrice = item.rentalPricing.firstHourPrice +
          (rentalHours - 1) * item.rentalPricing.subsequentHourPrice;
      }
    } else {
      rentalPrice = item.price;
    }
    return acc + rentalPrice * item.quantity;
  }, 0);

  // Remove discount logic, just use totalPrice
  let final = dispalyMoney(totalPrice);
  let totalDiscount = 0;
  totalPrice = dispalyMoney(totalPrice);

  return (
    <>
      <div className="cartPage">
        <MetaData title="Your Cart" />  
        <div className="cart_HeaderTop">
          <div className="headerLeft">
            <Typography variant="h5" component="h1" className="cartHeading">
              Shopping Cart
            </Typography>
            <Typography variant="body2" className="cartText3">
              TOTAL ({cartItems.length} item) <b>{final}</b>
            </Typography>
          </div>
          <Typography
            variant="body2"
            className="cartText2"
            onClick={() => history.push("/products")}
          >
            Continue Shopping
          </Typography>
        </div>

        <div className="separator_cart2"></div>

        {cartItems.length === 0 ? (
          <div className="emptyCartContainer">
            <RemoveShoppingCartIcon className="cartIcon" />

            <Typography variant="h5" component="h1" className="cartHeading">
              Your Shopping Cart is Empty
            </Typography>
            <Typography variant="body" className="cartText">
              Nothin' to see here.
            </Typography>
            <Typography variant="body" className="cartText">
              Let's get shopping!
            </Typography>
            <Link to="/products">
              <Button className="shopNowButton">Shop Now</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="cart_content_wrapper">
              <div className="cart_left_container">
                {cartItems &&
                  cartItems.map((item) => (
                    <Link
                      to="#"
                      style={{ textDecoration: "none", color: "none" }}
                    >
                      <CartItem
                        key={item.productId}
                        item={item}
                        deleteCartItems={deleteCartItems}
                        decreaseQuantity={decreaseQuantity}
                        increaseQuantity={increaseQuantity}
                        length={cartItems.length}
                        id = {item.productId}
                      />
                    </Link>
                  ))}
              </div>

              <div className="separator_cart3"></div>
              <div className="cart_right_container">
                <div className="order_summary">
                  <h4>
                    Order Summary &nbsp; ( {cartItems.length}{" "}
                    {cartItems.length > 1 ? "items" : "item"} )
                  </h4>
                  <div className="order_summary_details">
                    <div className="price order_Summary_Item">
                      <span>Original Price</span>
                      {/* ORIGINAL PRICE TOATAL */}
                      <p>{totalPrice}</p>
                    </div>

                    <div className="delivery order_Summary_Item">
                      <span>Delivery</span>
                      <p>
                        <b>Free</b>
                      </p>
                    </div>

                    <div className="separator_cart"></div>
                    <div className="total_price order_Summary_Item">
                      <div>
                        <h4>Total Price</h4>

                        <p
                          style={{
                            fontSize: "14px",
                            marginTop: "-10px",
                            color: "#414141",
                          }}
                        >
                          (Inclusive of all taxes)
                        </p>
                      </div>
                      <p>
                        <b>{final}</b>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="separator"></div>

                <div className="coupon-box-wrapper">
                  <div
                    className={`coupon-box-content ${
                      isFocused ? "focused" : ""
                    }`}
                  >
                    <TextField
                      label="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      onFocus={handleFocus}
                      onBlur={() => setIsFocused(false)}
                      error={!isValid}
                      helperText={!isValid && "Invalid coupon code"}
                      variant="outlined"
                      size="small"
                      style={{ width: "200px", marginRight: "1rem" }}
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      className="coupon-box-apply-btn"
                      onClick={handleApplyCoupon}
                    >
                      Apply
                    </Button>
                  </div>
                </div>

                <Button
                  variant="contained"
                  className="btn-custom"
                  onClick={checkoutHandler}
                >
                  Checkout
                </Button>

                <div className="paymentLogoImg">
                  <img
                    src={require("../../Image/cart/cart_img.png")}
                    alt="payemnt-icons"
                    className="paymentImg"
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Cart;

