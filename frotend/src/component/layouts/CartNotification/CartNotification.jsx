import React from "react";
import { Snackbar, Slide } from "@material-ui/core";
import { Alert } from '@mui/material'; // Change this import
import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const useStyles = makeStyles((theme) => ({
  snackbar: {
    top: "100px !important",
    right: "20px !important",
    left: "auto !important",
  },
  alert: {
    backgroundColor: "#4caf50",
    color: "white",
    fontSize: "1rem",
    fontWeight: "600",
    borderRadius: "12px",
    boxShadow: "0 8px 32px rgba(76, 175, 80, 0.3)",
    "& .MuiAlert-icon": {
      color: "white",
      fontSize: "1.5rem",
    },
  },
}));

function SlideTransition(props) {
  return <Slide {...props} direction="left" />;
}

const CartNotification = ({ open, onClose, productName }) => {
  const classes = useStyles();

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      className={classes.snackbar}
      TransitionComponent={SlideTransition}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        icon={<CheckCircleIcon />}
        severity="success"
        className={classes.alert}
        onClose={onClose}
      >
        {productName || "Product"} added to cart!
      </Alert>
    </Snackbar>
  );
};

export default CartNotification;
