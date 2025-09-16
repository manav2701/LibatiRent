import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  IconButton,
  Input,
  Tooltip,
  Box,
} from "@material-ui/core";
import DeleteIcon from "@mui/icons-material/Delete";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import {
  dispalyMoney,
  // generateDiscountedPrice, // Remove this import, not needed
} from "../DisplayMoney/DisplayMoney";

const useStyles = makeStyles((theme) => ({
  roots11: {
    display: "flex",
    alignItems: "center",
    padding: "1.5rem 2rem",
    width: "fit-content",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    margin: "1rem 2rem",
    height: "auto",

    [theme.breakpoints.down(899)]: {
      padding: "3rem 3rem",
      margin: "1rem 3rem",
    },
    [theme.breakpoints.down(699)]: {
      padding: "2rem",
      margin: "1rem",
      width: "80%",
    },
    [theme.breakpoints.down(499)]: {
      padding: "2rem",
      margin: "1rem",
      width: "65%",
    },
  },
  root11: {
    display: "flex",
    alignItems: "center",
    padding: "1rem 1rem",
    width: "fit-content",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.2)",
    margin: "1rem 2rem",
    height: "auto",

    [theme.breakpoints.down(899)]: {
      padding: "3rem",
      margin: "1rem 3rem",
    },
    [theme.breakpoints.down(699)]: {
      padding: "2rem",
      margin: "1rem",
      width: "80%",
    },

    [theme.breakpoints.down(499)]: {
      padding: "2rem",
      margin: "1rem",
      width: "65%",
    },
  },
  media: {
    width: "120px",
    height: "140px",
    marginRight: "18px",
    borderRadius: 10,
    background: "#fff",
    [theme.breakpoints.down(599)]: {
      width: "90px",
      height: "90px",
      marginRight: "0",
      marginBottom: "1rem",
    },
  },
  content: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    width: "fit-content",
    minHeight: "180px", // Ensure content area doesn't shrink
    flex: "1 1 auto",
    overflow: "visible", // Prevent scroll inside content
    [theme.breakpoints.down(699)]: {
      padding: "0",
      width: "fit-content",
      minHeight: "150px",
    },
    [theme.breakpoints.down(599)]: {
      padding: "0",
      width: "fit-content",
      minHeight: "120px",
    },
  },
  cartHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    gap: 12,
  },
  title: {
    fontSize: "1.15rem",
    fontWeight: 700,
    color: "#fff",
    flex: 1,
    minWidth: 0,
    wordBreak: "break-word",
    [theme.breakpoints.down(599)]: {
      fontSize: "1rem",
    },
  },
  cartDeleteIcon: {
    color: "#ef4444",
    "&:hover": {
      color: "#fff",
      background: "#ef4444",
    },
    padding: 8,
  },
  priceRow: {
    display: "flex",
    alignItems: "center",
    gap: 18,
    margin: "8px 0",
  },
  label: {
    fontWeight: 600,
    color: "#bae6fd",
    fontSize: 15,
    minWidth: 80,
  },
  value: {
    fontWeight: 700,
    color: "#fff",
    fontSize: 16,
  },
  oldPrice: {
    color: "#64748b",
    textDecoration: "line-through",
    fontSize: 14,
    marginLeft: 8,
  },
  qtyBox: {
    display: "flex",
    alignItems: "center",
    gap: 12, // Increased gap for better spacing
    margin: "8px 0",
    minWidth: "120px", // Increased min width for the quantity box
  },
  dateTimeBox: {
    marginTop: 8,
    background: "rgba(239,68,68,0.10)",
    borderRadius: 8,
    padding: "8px 14px",
    color: "#bae6fd",
    fontWeight: 600,
    fontSize: 15,
    display: "flex",
    flexDirection: "column",
    gap: 2,
    maxWidth: 420,
    [theme.breakpoints.down(599)]: {
      fontSize: 13,
      padding: "6px 8px",
      maxWidth: 320,
    },
  },
  totalBox: {
    marginTop: 12,
    fontWeight: 800,
    color: "#ef4444",
    fontSize: 18,
    letterSpacing: "0.5px",
  },
  rootWide: {
    display: "flex",
    alignItems: "center",
    padding: "1.5rem 1.2rem",
    width: "700px",
    boxShadow: "0px 0px 18px rgba(239,68,68,0.10)",
    margin: "1.2rem auto",
    borderRadius: 18,
    background: "rgba(30,41,59,0.92)",
    color: "#e0e7ef",
    border: "1.5px solid rgba(239,68,68,0.18)",
    position: "relative",
    minHeight: "220px", // Increased minHeight for stability
    overflow: "visible", // Prevent internal scroll
    [theme.breakpoints.down(899)]: {
      padding: "1rem",
      width: "98vw",
      maxWidth: "600px",
      minHeight: "200px",
    },
    [theme.breakpoints.down(599)]: {
      flexDirection: "column",
      width: "98vw",
      padding: "0.7rem",
      maxWidth: "600px",
      minHeight: "180px",
    },
  },
}));

function formatDubai(date, time) {
  if (!date || !time) return "";
  try {
    const dt = new Date(`${date}T${time}:00+04:00`);
    return dt.toLocaleString("en-GB", {
      timeZone: "Asia/Dubai",
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return `${date} ${time}`;
  }
}

function CartItem({
  deleteCartItems,
  item,
  decreaseQuantity,
  increaseQuantity,
  length,
}) {
  const classes = useStyles();

  // Always use the rental config and rental pricing from the item (do not recalculate or clear it)
  const rental = item.rentalConfig || {};
  const hasRental =
    rental &&
    rental.pickupDate &&
    rental.pickupTime &&
    rental.returnDate &&
    rental.returnTime;

  // Calculate rental hours only if rental config is present and valid
  let rentalHours = 1;
  if (hasRental) {
    const pickup = new Date(
      `${rental.pickupDate}T${rental.pickupTime}:00+04:00`
    );
    const returnTime = new Date(
      `${rental.returnDate}T${rental.returnTime}:00+04:00`
    );
    const diffMs = returnTime - pickup;
    rentalHours = Math.ceil(diffMs / (1000 * 60 * 60));
    rentalHours = Math.max(1, rentalHours);
  }

  // Use the rentalPricing and price from the item directly, do not fallback or recalculate
  let rentalPrice = 0;
  if (item.rentalPricing && hasRental) {
    if (rentalHours <= 1) {
      rentalPrice = item.rentalPricing.firstHourPrice;
    } else {
      rentalPrice =
        item.rentalPricing.firstHourPrice +
        (rentalHours - 1) * item.rentalPricing.subsequentHourPrice;
    }
  } else if (item.rentalPricing && !hasRental) {
    rentalPrice = item.rentalPricing.firstHourPrice;
  } else {
    rentalPrice = item.price;
  }

  let finalPrice = rentalPrice;
  let total = finalPrice * item.quantity;

  // Fallback image handler
  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = "https://via.placeholder.com/120x140?text=No+Image";
  };

  return (
    <Card className={classes.rootWide}>
      <CardMedia
        className={classes.media}
        image={item.image}
        title={item.name}
        component="img"
        onError={handleImageError}
      />
      <CardContent className={classes.content}>
        <div className={classes.cartHeader}>
          <Typography variant="subtitle1" className={classes.title}>
            {item.name}
          </Typography>
          <Tooltip title="Remove from cart">
            <IconButton
              aria-label="delete"
              className={classes.cartDeleteIcon}
              onClick={() => deleteCartItems(item.productId)}
              size="large"
              style={{
                width: 48,
                height: 48,
                minWidth: 48,
                minHeight: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 38,
                  height: 38,
                }}
              >
                <DeleteIcon style={{ width: 38, height: 38 }} />
              </span>
            </IconButton>
          </Tooltip>
        </div>

        <div className={classes.priceRow}>
          <span className={classes.label}>Price:</span>
          <span className={classes.value}>{finalPrice}</span>
        </div>

        {/* Show rental duration if available */}
        {hasRental && (
          <div
            style={{
              color: "#bae6fd",
              fontWeight: 600,
              fontSize: 15,
              margin: "4px 0",
            }}
          >
            Rental Duration: {rentalHours}{" "}
            {rentalHours === 1 ? "hour" : "hours"}
          </div>
        )}

        <div className={classes.qtyBox}>
          <span className={classes.label}>Qty:</span>
          <IconButton
            onClick={() => decreaseQuantity(item.productId, item.quantity)}
            className="additem_decrease"
            size="small"
            style={{
              color: "#fff",
              background: "#1e293b",
              borderRadius: 6,
              width: 36, // Reduced from 40
              height: 36, // Reduced from 40
              minWidth: 36,
              minHeight: 36,
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <RemoveIcon fontSize="medium" />
          </IconButton>
          <Input
            readOnly
            type="number"
            value={item.quantity}
            className="input"
            inputProps={{
              style: {
                width: 32, // Further reduced width
                fontSize: "1rem",
                fontWeight: 600,
                textAlign: "center",
                color: "#f3f4f6",
                background: "#23272f",
                borderRadius: 6,
                padding: "2px 4px",
                height: 18, // Further reduced height
                minHeight: 18,
                maxHeight: 22,
                lineHeight: "18px",
              },
            }}
            style={{
              width: 32, // Further reduced width
              minWidth: 0,
              color: "#f3f4f6",
              background: "#23272f",
              borderRadius: 6,
              margin: "0 8px",
              height: 22, // Further reduced height
              fontSize: "1rem",
              textAlign: "center",
              padding: 0,
              lineHeight: "18px",
              boxSizing: "border-box",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />
          <IconButton
            onClick={() =>
              increaseQuantity(item.productId, item.quantity, item.stock)
            }
            className="additem_increase"
            size="small"
            style={{
              color: "#fff",
              background: "#1e293b",
              borderRadius: 6,
              width: 36, // Reduced from 40
              height: 36, // Reduced from 40
              minWidth: 36,
              minHeight: 36,
              fontSize: "1.1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AddIcon fontSize="medium" />
          </IconButton>
        </div>

        {/* Always show rental info if present */}
        <Box className={classes.dateTimeBox}>
          <span>
            <b>Pickup:</b>{" "}
            {hasRental
              ? formatDubai(rental.pickupDate, rental.pickupTime)
              : "Not selected"}
          </span>
          <span>
            <b>Return:</b>{" "}
            {hasRental
              ? formatDubai(rental.returnDate, rental.returnTime)
              : "Not selected"}
          </span>
        </Box>

        <div className={classes.totalBox}>Total: {total}</div>
      </CardContent>
    </Card>
  );
}
export default CartItem;
