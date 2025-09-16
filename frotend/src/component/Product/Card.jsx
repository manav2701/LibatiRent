// Card.jsx (Product Card)
import React from "react";
import { Card, CardContent, CardMedia, Typography, Button, Chip } from "@mui/material";
import { styled } from "@mui/material/styles";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useHistory } from "react-router-dom";

// Styled card to match screenshot
const StyledCard = styled(Card)(() => ({
  background: "#0f172a",
  color: "white",
  borderRadius: 12,
  overflow: "hidden",
  position: "relative",
  boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
  transition: "transform 0.2s ease",
  "&:hover": { transform: "translateY(-5px)" },
}));

const DiscountChip = styled(Chip)(() => ({
  position: "absolute",
  top: 12,
  left: 12,
  backgroundColor: "#ef4444",
  color: "white",
  fontWeight: 700,
  fontSize: 12,
}));

const CategoryChip = styled(Chip)(() => ({
  position: "absolute",
  top: 12,
  right: 12,
  backgroundColor: "#3b82f6",
  color: "white",
  fontWeight: 600,
  fontSize: 12,
}));

const SpecChip = styled(Chip)(() => ({
  marginRight: 6,
  marginTop: 6,
  backgroundColor: "#1e293b",
  color: "#cbd5e1",
  fontSize: 14,
  height: 28,
}));

const ImageWrapper = styled("div")(() => ({
  width: "100%",
  height: 220,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "white",
  position: "relative",
  overflow: "hidden",
}));

export default function MyCard({
  product,
  rentalConfig,
  rentalPrice,
  isRentalConfigApplied,
  stock,
  onRequireRentalConfig,
  onAddToCart,
}) {
  const history = useHistory();

  const discountPercent = product.discount
    ? Math.round(((product.price - product.rentalPrice) / product.price) * 100)
    : null;

  const handleAddToCart = () => {
    if (!isRentalConfigApplied && typeof onRequireRentalConfig === "function") {
      onRequireRentalConfig();
      return;
    }
    if (typeof onAddToCart === "function") {
      onAddToCart(product, rentalConfig);
    }
  };

  // Make card clickable to go to product details
  const handleCardClick = (e) => {
    if (e.target.closest("button")) return;
    history.push(`/product/${product._id}`);
  };

  // Tennis/Padel specs chips
  const chips = [];
  if (product.tennisSpecs) {
    if (product.tennisSpecs.brand) chips.push(<SpecChip key="brand" label={product.tennisSpecs.brand} />);
    if (product.tennisSpecs.headSize) chips.push(<SpecChip key="headSize" label={product.tennisSpecs.headSize} />);
    if (product.tennisSpecs.gripSize) chips.push(<SpecChip key="gripSize" label={`Grip ${product.tennisSpecs.gripSize}`} />);
  }
  if (product.padelSpecs) {
    if (product.padelSpecs.brand) chips.push(<SpecChip key="padelBrand" label={product.padelSpecs.brand} />);
    if (product.padelSpecs.shape) chips.push(<SpecChip key="shape" label={product.padelSpecs.shape} />);
    if (product.padelSpecs.weight) chips.push(<SpecChip key="weight" label={`${product.padelSpecs.weight}g`} />);
  }
  if (!chips.length) {
    if (product.brand) chips.push(<SpecChip key="brand" label={product.brand} />);
    if (product.headSize) chips.push(<SpecChip key="headSize" label={product.headSize} />);
    if (product.gripSize) chips.push(<SpecChip key="gripSize" label={`Grip ${product.gripSize}`} />);
  }

  return (
    <StyledCard
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      {/* Discount & Category */}
      {discountPercent > 0 && <DiscountChip label={`${discountPercent}% OFF`} />}
      {product.category && <CategoryChip label={product.category} />}

      {/* Product Image with fixed wrapper */}
      <ImageWrapper>
        <CardMedia
          component="img"
          image={product.images?.[0]?.url || "https://via.placeholder.com/300"}
          alt={product.name}
          style={{
            maxHeight: "90%",
            maxWidth: "90%",
            objectFit: "contain",
            background: "white",
            margin: "auto",
            display: "block",
          }}
        />
      </ImageWrapper>

      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-start",
          minHeight: 210,
        }}
      >
        {/* Rental Duration */}
        {product.rentalDuration && (
          <Typography
            variant="body2"
            sx={{
              background: "#1e293b",
              color: "#38bdf8",
              p: "2px 10px",
              borderRadius: 20,
              display: "inline-block",
              mb: 1,
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            {product.rentalDuration}
          </Typography>
        )}

        {/* Product Name */}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: "white",
            minHeight: 32,
            display: "flex",
            alignItems: "center",
          }}
        >
          {product.name}
        </Typography>

        {/* Specs chips (brand, size, grip, etc.) */}
        <div style={{ display: "flex", flexWrap: "wrap", marginBottom: 8, minHeight: 36 }}>
          {chips}
        </div>

        {/* Price - only show if rental config is applied */}
        {isRentalConfigApplied && (
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#38bdf8" }}>
            AED {rentalPrice || product.rentalPrice || product.price}
            {discountPercent > 0 && (
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#64748b",
                  marginLeft: 8,
                  fontSize: 16,
                }}
              >
                AED {product.price}
              </span>
            )}
          </Typography>
        )}

        {/* Stock Info */}
        <Typography
          variant="body2"
          sx={{
            color: stock > 0 ? "#22c55e" : "#ef4444",
            mt: 1,
            mb: 2,
            fontWeight: 500,
          }}
        >
          {stock > 0
            ? `✓ In Stock (${stock} available)`
            : "Out of Stock"}
        </Typography>

        {/* Add to Cart */}
        <Button
          fullWidth
          variant="contained"
          startIcon={<ShoppingCartIcon sx={{ fontSize: 28 }} />}
          onClick={(e) => {
            e.stopPropagation();
            handleAddToCart();
          }}
          sx={{
            mt: 1,
            background: "linear-gradient(90deg, #3b82f6, #ef4444)",
            color: "white",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 2,
            "&:hover": {
              background: "linear-gradient(90deg, #2563eb, #dc2626)",
            },
          }}
          disabled={stock <= 0}
        >
          <span style={{ fontSize: 18 }}>Add to Cart</span>
        </Button>
      </CardContent>
    </StyledCard>
  );
}
