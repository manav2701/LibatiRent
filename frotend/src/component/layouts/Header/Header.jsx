import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { AppBar, Toolbar, Typography, IconButton, Badge } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: "#161616",
    color: "white",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontWeight: 700,
    letterSpacing: "1px",
  },
  cartIcon: {
    position: "relative",
    color: "white",
  },
  cartBadge: {
    "& .MuiBadge-badge": {
      backgroundColor: "#ef4444",
      color: "white",
      fontWeight: "bold",
      fontSize: "0.75rem",
      minWidth: "20px",
      height: "20px",
      borderRadius: "10px",
      border: "2px solid white",
      right: -3,
      top: 8,
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const { cartItems } = useSelector((state) => state.cart);

  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <IconButton
          edge="start"
          className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Cricket Weapon Store
        </Typography>
        <IconButton color="inherit">
          <Badge
            badgeContent={cartItems.length}
            className={classes.cartBadge}
            overlap="rectangular"
          >
            <ShoppingCartIcon className={classes.cartIcon} />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Header;