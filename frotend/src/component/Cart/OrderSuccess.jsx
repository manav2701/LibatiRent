import React from "react";

import { makeStyles } from "@material-ui/core/styles";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import { Typography, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  orderSuccess: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "9rem",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    fontFamily: "'Poppins', sans-serif",
    minHeight: "100vh",
  },
  successIcon: {
    fontSize: "8rem",
    color: "#FF00BF",
    marginBottom: theme.spacing(4),
    filter: "drop-shadow(0 8px 25px rgba(255, 0, 191, 0.3))",
  },
  successText: {
    marginBottom: theme.spacing(2),
    fontWeight: "700",
    fontSize: "2.5rem",
    color: "#2c2c2c",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(135deg, #FF00BF, #120A8F)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  link: {
    textDecoration: "none",
  },
  viewOrdersButton: {
    marginTop: theme.spacing(4),
    padding: "15px 40px",
    background: "linear-gradient(135deg, #FF00BF, #120A8F)",
    color: "white",
    borderRadius: "50px",
    textTransform: "none",
    fontWeight: "600",
    fontSize: "18px",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 25px rgba(255, 0, 191, 0.3)",
    fontFamily: "'Poppins', sans-serif",
    "&:hover": {
      background: "#120A8F",
      transform: "translateY(-2px)",
      boxShadow: "0 12px 35px rgba(18, 10, 143, 0.4)",
    },
  },
}));

function OrderSuccess() {
  const classes = useStyles();

  return (
    <div className={classes.orderSuccess}>
      <CheckCircleIcon className={classes.successIcon} />

      <Typography variant="h4" className={classes.successText}>
        Congratulations!
        <br />
        Your Order has been Placed Successfully
      </Typography>
      <Link to="/orders" className={classes.link}>
        <Button variant="contained" className={classes.viewOrdersButton}>
          View Orders
        </Button>
      </Link>
    </div>
  );
}

export default OrderSuccess;
