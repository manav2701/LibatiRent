import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import { dispalyMoney } from "../DisplayMoney/DisplayMoney";
import { addItemToCart, removeItemFromCart } from "../../actions/cartAction";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import CartNotification from "../layouts/CartNotification/CartNotification";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--bg-secondary)",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    borderRadius: "16px",
    overflow: "hidden",
    border: "1px solid var(--border-color)",
    color: "var(--text-primary)",
    "&:hover": {
      transform: "translateY(-8px)",
      boxShadow: "0 20px 40px rgba(59, 130, 246, 0.15)",
      "& $media": {
        transform: "scale(1.05)",
      },
    },
  },
  media: {
    height: 320,
    backgroundSize: "cover",
    backgroundPosition: "center",
    transition: "transform 0.3s ease",
    position: "relative",
    marginTop: "0px", // Remove margin to span to edge
  },
  content: {
    padding: theme.spacing(2.5),
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "var(--bg-secondary)",
    color: "var(--text-primary)",
  },
  badgeContainer: {
    position: "absolute",
    top: 12, // Adjusted for edge-to-edge image
    left: 12,
    right: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    zIndex: 2,
  },
  discountBadge: {
    backgroundColor: "var(--accent-red)",
    color: "white",
    fontWeight: "bold",
    fontSize: "0.75rem",
    borderRadius: "12px",
    padding: "4px 8px",
    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.3)",
  },
  categoryBadge: {
    backgroundColor: "var(--accent-blue)",
    color: "white",
    fontWeight: "600",
    fontSize: "0.7rem",
    borderRadius: "12px",
    padding: "3px 8px",
    boxShadow: "0 2px 8px rgba(59, 130, 246, 0.3)",
  },
  durationChip: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "var(--accent-blue)",
    fontWeight: "700",
    fontSize: "0.75rem",
    height: "28px",
    marginBottom: theme.spacing(1.5),
    border: "1px solid rgba(59, 130, 246, 0.3)",
    "& .MuiChip-icon": {
      fontSize: "0.9rem",
      color: "var(--accent-blue)",
    },
  },
  title: {
    fontSize: "1.1rem",
    fontWeight: "700",
    color: "var(--text-primary)",
    lineHeight: 1.3,
    marginBottom: theme.spacing(1),
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    minHeight: "2.6rem",
    "&:hover": {
      color: "var(--accent-blue)",
    },
  },
  priceContainer: {
    display: "flex",
    alignItems: "baseline",
    gap: theme.spacing(1),
    marginBottom: theme.spacing(2),
  },
  currentPrice: {
    fontSize: "1.4rem",
    fontWeight: "800",
    color: "var(--accent-blue)",
  },
  originalPrice: {
    fontSize: "1rem",
    color: "var(--text-secondary)",
    textDecoration: "line-through",
    fontWeight: "500",
  },
  stockStatus: {
    marginBottom: theme.spacing(2),
  },
  inStock: {
    color: "var(--accent-blue)",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  outOfStock: {
    color: "var(--accent-red)",
    fontWeight: "600",
    fontSize: "0.85rem",
  },
  addToCartButton: {
    marginTop: "auto",
    background: "linear-gradient(135deg, var(--accent-blue), var(--accent-red))",
    color: "white",
    fontWeight: "700",
    borderRadius: "12px",
    padding: "12px",
    textTransform: "none",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3)",
    "&:hover": {
      background: "linear-gradient(135deg, var(--accent-red), var(--accent-blue))",
      transform: "translateY(-2px)",
      boxShadow: "0 12px 35px rgba(59, 130, 246, 0.4)",
    },
    "&:disabled": {
      backgroundColor: "var(--border-color)",
      color: "var(--text-secondary)",
    },
  },
  specsContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: theme.spacing(0.5),
    marginBottom: theme.spacing(1.5),
  },
  specChip: {
    fontSize: "0.7rem",
    height: "22px",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    color: "var(--accent-blue)",
    fontWeight: "500",
    border: "1px solid rgba(59, 130, 246, 0.3)",
  },
  cartIcon: {
    fontSize: "1.5rem !important", // Increased icon size
  },
  quantityControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    borderRadius: "12px",
    padding: "8px",
    border: "1px solid var(--accent-blue)",
  },
  quantityButton: {
    minWidth: "32px",
    height: "32px",
    backgroundColor: "var(--accent-blue)",
    color: "white",
    "&:hover": {
      backgroundColor: "var(--accent-blue)",
      transform: "scale(1.1)",
    },
  },
  quantityText: {
    fontWeight: "700",
    fontSize: "1rem",
    color: "var(--accent-blue)",
    minWidth: "40px",
    textAlign: "center",
  },
}));

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const alert = useAlert();
  const [showNotification, setShowNotification] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const history = useHistory();

  if (!product) {
    return null;
  }

  const {
    _id = "",
    name = "Unnamed Product",
    images = [],
    price = 0,
    sportsCategory = "",
    Stock = 0,
    tennisSpecs = {},
    padelSpecs = {},
  } = product;

  // Cart logic
  const cartItem = cartItems.find(item => item.product === _id);
  const isInCart = !!cartItem;
  const cartQuantity = cartItem ? cartItem.quantity : 0;

  // Move getSpecs function definition above its first usage
  const getSpecs = () => {
    const specs = [];
    if (sportsCategory === "Tennis" && tennisSpecs) {
      if (tennisSpecs.brand) specs.push(tennisSpecs.brand);
      if (tennisSpecs.headSize) specs.push(tennisSpecs.headSize);
      if (tennisSpecs.gripSize) specs.push(`Grip ${tennisSpecs.gripSize}`);
      if (tennisSpecs.unstrungWeight) specs.push(`${tennisSpecs.unstrungWeight}g`);
    } else if (sportsCategory === "Padel" && padelSpecs) {
      if (padelSpecs.brand) specs.push(padelSpecs.brand);
      if (padelSpecs.shape) specs.push(padelSpecs.shape);
      if (padelSpecs.weight) specs.push(`${padelSpecs.weight}g`);
    }
    return specs.slice(0, 3);
  };

  const specs = getSpecs();

  // Always navigate to product details on any click
  const handleCardClick = (e) => {
    e.preventDefault();
    history.push(`/product/${_id}?openRentalConfig=true`);
  };

  return (
    <>
      <Card className={classes.root} onClick={handleCardClick} style={{ cursor: "pointer" }}>
        <CardActionArea>
          <div style={{ position: "relative" }}>
            <CardMedia
              className={classes.media}
              image={images && images.length > 0 ? images[0].url : "/placeholder.svg"}
              title={name}
            />
            <div className={classes.badgeContainer}>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {/* Remove discount badge logic */}
              </div>
              {sportsCategory && (
                <span className={classes.categoryBadge}>
                  {sportsCategory === "Tennis" && "🎾"}
                  {sportsCategory === "Padel" && "🏓"}
                  {" " + sportsCategory}
                </span>
              )}
            </div>
          </div>

          <CardContent className={classes.content}>
            <Typography variant="h6" className={classes.title}>
              {name}
            </Typography>

            {specs.length > 0 && (
              <div className={classes.specsContainer}>
                {specs.map((spec, index) => (
                  <Chip
                    key={index}
                    label={spec}
                    size="small"
                    className={classes.specChip}
                  />
                ))}
              </div>
            )}

            {/* Do NOT show price until rental config is set */}
            <div className={classes.priceContainer}>
              <span style={{ color: "#64748b", fontWeight: 400, fontSize: "1rem" }}>
                Select rental dates & times to view price
              </span>
            </div>

            <div className={classes.stockStatus}>
              {Stock > 0 ? (
                <span className={classes.inStock}>
                  ✓ In Stock ({Stock} available)
                </span>
              ) : (
                <span className={classes.outOfStock}>
                  ✗ Out of Stock
                </span>
              )}
            </div>
          </CardContent>
        </CardActionArea>
        <Box p={2.5} pt={0} style={{ backgroundColor: "var(--bg-secondary)" }}>
          <Button
            variant="contained"
            fullWidth
            className={classes.addToCartButton}
            onClick={handleCardClick}
            disabled={Stock <= 0}
            startIcon={<span className={classes.cartIcon}>🛒</span>}
          >
            {Stock <= 0 ? "Out of Stock" : "Add to Cart"}
          </Button>
        </Box>
      </Card>

      <CartNotification
        open={showNotification}
        onClose={() => setShowNotification(false)}
        productName={name}
      />
    </>
  );
};

export default ProductCard;