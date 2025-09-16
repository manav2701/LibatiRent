import {
  ADD_TO_CART,
  REMOVE_CART_ITEM,
  SAVE_SHIPPING_INFO,
} from "../constants/cartConstant.js";
import axios from "axios";

// Add Items to Cart
export const addItemToCart = (id, quantity, cartData = null) => async (dispatch, getState) => {
  try {
    const { data } = await axios.get(`/api/v1/product/${id}`);

    // Only add if quantity > 0
    if (!quantity || quantity < 1) return;

    // Check if already in cart with same rental config
    const existingItem = getState().cart.cartItems.find(item =>
      item.product === id &&
      JSON.stringify(item.rentalConfig || {}) === JSON.stringify(cartData?.rentalConfig || {})
    );

    // If already in cart and quantity is 0, remove it
    if (existingItem && quantity === 0) {
      dispatch({
        type: REMOVE_CART_ITEM,
        payload: id,
      });
      return;
    }

    const item = {
      product: data.product._id,
      productId: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0]?.url || "",
      stock: data.product.Stock,
      quantity: typeof quantity === 'number' && quantity > 0 ? quantity : 1,
      rentalConfig: cartData?.rentalConfig || null,
      rentalPricing: data.product.rentalPricing || null, // Add this line
    };

    // Ensure quantity doesn't exceed stock
    item.quantity = Math.min(item.quantity, item.stock);

    // Only add if quantity > 0
    if (item.quantity > 0) {
      dispatch({
        type: ADD_TO_CART,
        payload: item,
      });
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

// Remove Items from Cart
export const removeItemFromCart = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: REMOVE_CART_ITEM,
      payload: id,
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
  }
};

// Save Shipping Info
export const saveShippingInfo = (data) => async (dispatch) => {
  try {
    dispatch({
      type: SAVE_SHIPPING_INFO,
      payload: data,
    });
    // localStorage removed
  } catch (error) {
    console.error("Error saving shipping info:", error);
  }
};

// Clear Cart
export const clearCart = () => async (dispatch) => {
  try {
    dispatch({ type: "CLEAR_CART" });
    // localStorage removed
  } catch (error) {
    console.error("Error clearing cart:", error);
  }
};
   