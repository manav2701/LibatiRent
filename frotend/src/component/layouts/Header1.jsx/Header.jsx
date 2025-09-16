import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  Button,
  Menu,
  MenuItem,
  Box,
  IconButton,
  Badge,
  InputBase,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import SearchIcon from "@material-ui/icons/Search";
import { useSelector } from "react-redux";
import ProfileModal from "./ProfileModel";
import LibatiLogo from "../../../Image/about/Libati.png"; // Adjust the path to your logo image

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "fixed !important",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1100,
    transition: "all 0.3s ease",
    background: "rgba(15, 23, 42, 0.95)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",
    "&.transparent": {
      background: "transparent",
      backdropFilter: "none",
      boxShadow: "none",
    },
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 2rem 0 0", // Remove left padding since logo extends to edge
    minHeight: "6rem",
    [theme.breakpoints.down("md")]: {
      padding: "0 1rem 0 0",
      minHeight: "5rem",
    },
  },
  logoContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    height: "6rem", // Fixed height for logo container
  },
  logo: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    transition: "all 0.3s ease",
    position: "relative",
    zIndex: 1,
    paddingLeft: "2rem", // Reduced padding since no white background
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  logoImage: {
    height: "clamp(8rem, 14vw, 12rem)", // Adjusted size without white background
    width: "auto",
    filter: "brightness(1.2) drop-shadow(0 0.25rem 0.5rem rgba(255, 255, 255, 0.8))", // White drop shadow for visibility
    transition: "all 0.3s ease",
    backgroundColor: "transparent",
    mixBlendMode: "normal",
    "&:hover": {
      filter: "brightness(1.3) drop-shadow(0 0.375rem 0.75rem rgba(255, 255, 255, 0.9))",
    },
  },
  navigation: {
    display: "flex",
    alignItems: "center",
    gap: "clamp(1rem, 8vw, 9.375rem)", // Responsive gap
    flexWrap: "wrap", // Allow wrapping on zoom
    [theme.breakpoints.down("lg")]: {
      gap: "2rem",
    },
    [theme.breakpoints.down("md")]: {
      gap: "1.25rem",
    },
  },
  navButton: {
    color: "rgba(255, 255, 255, 0.95) !important",
    fontWeight: "700 !important",
    fontSize: "clamp(0.875rem, 2vw, 1.125rem) !important", // Responsive font size
    textTransform: "none !important",
    padding: "1rem 1.5rem !important", // Changed to rem
    borderRadius: "0.75rem !important",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important",
    fontFamily: "'Inter', 'Poppins', sans-serif !important",
    textShadow: "0 0 0.0625rem rgba(255, 255, 255, 0.3)",
    position: "relative",
    overflow: "hidden",
    minHeight: "3.125rem", // 50px in rem
    whiteSpace: "nowrap", // Prevent text wrapping
    "&:hover": {
      background: "rgba(255, 255, 255, 0.08) !important",
      backdropFilter: "blur(0.75rem)",
      color: "#3b82f6 !important",
      transform: "translateY(-0.125rem)",
      textShadow: "0 0.125rem 0.5rem rgba(59, 130, 246, 0.3)",
    },
  },
  dropdownButton: {
    color: "rgba(255, 255, 255, 0.95) !important",
    fontWeight: "700 !important",
    fontSize: "clamp(0.875rem, 2vw, 1.125rem) !important", // Responsive font size
    textTransform: "none !important",
    padding: "1rem 1.5rem !important",
    borderRadius: "0.75rem !important",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important",
    fontFamily: "'Inter', 'Poppins', sans-serif !important",
    textShadow: "0 0 0.0625rem rgba(255, 255, 255, 0.3)",
    minHeight: "3.125rem",
    whiteSpace: "nowrap",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.08) !important",
      backdropFilter: "blur(0.75rem)",
      color: "#3b82f6 !important",
      transform: "translateY(-0.125rem)",
    },
  },
  menu: {
    marginTop: "8px",
    "& .MuiPaper-root": {
      borderRadius: "16px",
      border: "1px solid rgba(59, 130, 246, 0.2)",
      boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
      minWidth: "220px",
      background: "rgba(15,23,42,0.85) !important", // glassmorphism dark
      backdropFilter: "blur(18px) !important",
      color: "#e0e7ef !important",
      animation: "$dropdownFadeIn 0.35s cubic-bezier(0.4,0,0.2,1)",
    },
  },
  "@keyframes dropdownFadeIn": {
    "0%": { opacity: 0, transform: "translateY(-20px) scaleY(0.95)" },
    "100%": { opacity: 1, transform: "translateY(0) scaleY(1)" },
  },
  menuItem: {
    padding: "16px 24px",
    fontSize: "1.1rem",
    fontWeight: "600",
    color: "#e0e7ef !important", // high contrast on dark
    fontFamily: "'Inter', sans-serif",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "rgba(59, 130, 246, 0.18)",
      color: "#38bdf8 !important",
      backdropFilter: "blur(8px)",
    },
  },
  categoryIcon: {
    marginRight: "12px", // Increased from 8px
    fontSize: "1.4rem", // Increased from 1.2rem
  },
  cartButton: {
    color: "rgba(255, 255, 255, 0.9) !important",
    padding: "16px !important",
    borderRadius: "15px !important",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important",
    minHeight: "64px !important", // Increased from 100px to 64px for better badge fit
    minWidth: "64px !important",  // Increased from 100x to 64px for better badge fit
    display: "flex !important",
    alignItems: "center !important",
    justifyContent: "center !important",
    position: "relative !important", // Ensure badge is positioned relative to button
    "&:hover": {
      background: "rgba(255, 255, 255, 0.08) !important",
      backdropFilter: "blur(12px)",
      color: "#3b82f6 !important",
      transform: "translateY(-2px) scale(1.05)",
    },
    "& .MuiSvgIcon-root": {
      fontSize: "2rem",
    },
  },
cartBadge: {
  "& .MuiBadge-badge": {
    backgroundColor: "#3b82f6",
    color: "white",
    fontWeight: 800,
    fontSize: "clamp(0.5rem, 1vw, 0.8rem)",
    minWidth: "2em", // small minimum for 1-digit
    height: "2em",
    padding: "0 0.1em", // allows room for 2–3 digits
    borderRadius: "999px", // pill shape for multi-digit numbers
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 0.25rem 0.75rem rgba(59, 130, 246, 0.4)",
    right: "10px", // move outside cart
    top: "8px",
    zIndex: 2,
    letterSpacing: "0.02em",
    overflow: "visible !important", // prevent clipping
  },
},

  searchContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(1.25rem)",
    border: "0.0625rem solid rgba(255, 255, 255, 0.2)",
    borderRadius: "3.125rem",
    padding: "0 1.5rem",
    minWidth: "clamp(15rem, 25vw, 22.5rem)", // Responsive width between 240px and 360px
    height: "3.125rem", // 50px in rem
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 0.5rem 1.5625rem rgba(0, 0, 0, 0.1)",
    "&:hover": {
      background: "rgba(255, 255, 255, 0.15)",
      borderColor: "rgba(59, 130, 246, 0.4)",
      transform: "translateY(-0.125rem)",
      boxShadow: "0 0.75rem 2.1875rem rgba(59, 130, 246, 0.2)",
    },
    "&:focus-within": {
      background: "rgba(255, 255, 255, 0.2)",
      borderColor: "#3b82f6",
      boxShadow: "0 0 0 0.25rem rgba(59, 130, 246, 0.15)",
      transform: "translateY(-0.125rem)",
    },
  },
  searchIcon: {
    color: "rgba(255, 255, 255, 0.7)",
    marginRight: "16px",
    fontSize: "24px",
    transition: "color 0.3s ease",
    flexShrink: 0,
  },
  searchInput: {
    flex: 1,
    border: "none !important",
    outline: "none !important",
    background: "transparent !important",
    color: "#f8fafc !important",
    fontSize: "18px !important",
    fontWeight: "500 !important",
    padding: "0 !important",
    fontFamily: "'Inter', sans-serif !important",
    height: "auto !important",
    "&::placeholder": {
      color: "rgba(255, 255, 255, 0.6) !important",
      fontWeight: "400 !important",
    },
    "&:focus": {
      outline: "none !important",
      border: "none !important",
      boxShadow: "none !important",
    },
    "& input": {
      padding: "0 !important",
      border: "none !important",
      outline: "none !important",
      background: "transparent !important",
    },
  },
  signupButton: {
    background: "#3b82f6 !important", // theme blue
    color: "#f3f4f6 !important", // light white
    border: "0.0625rem solid rgba(59, 130, 246, 0.3) !important",
    borderRadius: "3.125rem !important",
    padding: "1rem 2rem !important",
    fontWeight: "700 !important",
    fontSize: "clamp(0.875rem, 1.5vw, 1rem) !important", // Responsive font size
    fontFamily: "'Inter', 'Poppins', sans-serif !important",
    cursor: "pointer !important",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important",
    boxShadow: "0 0.5rem 1.5625rem rgba(59, 130, 246, 0.15) !important",
    textTransform: "none !important",
    minWidth: "clamp(6rem, 10vw, 7.5rem) !important",
    minHeight: "3.125rem !important",
    whiteSpace: "nowrap",
    "&:hover": {
      background: "#2563eb !important",
      color: "#e0e7ef !important",
      transform: "translateY(-0.1875rem) scale(1.02) !important",
      boxShadow: "0 0.9375rem 2.1875rem rgba(59, 130, 246, 0.2) !important",
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const history = useHistory();
  const [productsMenuAnchor, setProductsMenuAnchor] = useState(null);
  const [productsMenuOpen, setProductsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAtTop, setIsAtTop] = useState(true);

  // Get cart items count
  const { cartItems } = useSelector((state) => state.cart);
  const cartItemsCount = cartItems ? cartItems.length : 0;

  // Get user and authentication status
  const { user, isAuthenticated } = useSelector((state) => state.userData || {});

  const handleProductsMenuOpen = (event) => {
    setProductsMenuAnchor(event.currentTarget);
  };

  const handleProductsMenuClose = () => {
    setProductsMenuAnchor(null);
  };

  const handleCategoryClick = (category) => {
    handleProductsMenuClose();
    if (category === "all") {
      history.push("/products");
    } else {
      history.push(`/products?category=${category}`);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      history.push(`/products/${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSignupClick = () => {
    history.push("/login");
  };

  // Handle scroll for header transparency
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsAtTop(scrollPosition < 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- Hover logic for Products dropdown ---
  // Use refs to avoid closure issues with timeout
  const menuCloseTimeoutRef = React.useRef();

  const handleProductsMenuMouseEnter = (event) => {
    clearTimeout(menuCloseTimeoutRef.current);
    setProductsMenuAnchor(event.currentTarget);
    setProductsMenuOpen(true);
  };
  const handleProductsMenuMouseLeave = () => {
    menuCloseTimeoutRef.current = setTimeout(() => {
      setProductsMenuOpen(false);
      setProductsMenuAnchor(null);
    }, 120);
  };
  const handleMenuMouseEnter = () => {
    clearTimeout(menuCloseTimeoutRef.current);
    setProductsMenuOpen(true);
  };
  const handleMenuMouseLeave = () => {
    menuCloseTimeoutRef.current = setTimeout(() => {
      setProductsMenuOpen(false);
      setProductsMenuAnchor(null);
    }, 120);
  };

  return (
    <AppBar 
      position="fixed" 
      className={`${classes.appBar} ${isAtTop ? 'transparent' : ''}`}
    >
      <Toolbar className={classes.toolbar}>
        {/* Logo with white background extending to left edge */}
        <div className={classes.logoContainer}>
          <Link to="/" className={classes.logo}>
            <img
              src={LibatiLogo}
              alt="Libati Sports Rental"
              className={classes.logoImage}
            />
          </Link>
        </div>

        {/* Navigation - Swapped positions */}
        <Box className={classes.navigation}>
          {/* Glass Search Bar - moved to first position */}
          <div className={classes.searchContainer}>
            <SearchIcon className={classes.searchIcon} />
            <InputBase
              placeholder="Search equipment..."
              className={classes.searchInput}
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearchSubmit(e);
                }
              }}
              inputProps={{
                style: {
                  padding: 0,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                }
              }}
            />
          </div>

          {/* Home button - moved to second position */}
          <Button
            component={Link}
            to="/"
            className={classes.navButton}
          >
            Home
          </Button>

          {/* Products Dropdown - now on hover */}
          <div
            onMouseEnter={handleProductsMenuMouseEnter}
            onMouseLeave={handleProductsMenuMouseLeave}
            style={{ display: "inline-block", position: "relative" }}
          >
            <Button
              className={classes.dropdownButton}
              endIcon={<ExpandMoreIcon />}
              aria-haspopup="true"
              aria-controls="products-menu"
              aria-expanded={productsMenuOpen ? "true" : undefined}
              id="products-menu-trigger"
            >
              Products
            </Button>
            <Menu
              id="products-menu"
              anchorEl={productsMenuAnchor}
              open={Boolean(productsMenuAnchor) && productsMenuOpen}
              onClose={() => {
                setProductsMenuOpen(false);
                setProductsMenuAnchor(null);
              }}
              className={classes.menu}
              // --- Ensure dropdown starts directly below the Products button ---
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center",
              }}
              getContentAnchorEl={null} // <-- This is important for correct positioning in MUI v4
              MenuListProps={{
                onMouseEnter: handleMenuMouseEnter,
                onMouseLeave: handleMenuMouseLeave,
                style: { padding: 0 },
              }}
              PaperProps={{
                style: {
                  marginTop: 0,
                  minWidth: productsMenuAnchor
                    ? productsMenuAnchor.offsetWidth
                    : undefined,
                }
              }}
            >
              <MenuItem
                onClick={() => handleCategoryClick("all")}
                className={classes.menuItem}
              >
                <span className={classes.categoryIcon}>🏆</span>
                All Equipment
              </MenuItem>
              <MenuItem
                onClick={() => handleCategoryClick("Tennis")}
                className={classes.menuItem}
              >
                <span className={classes.categoryIcon}>🎾</span>
                Tennis Equipment
              </MenuItem>
              <MenuItem
                onClick={() => handleCategoryClick("Padel")}
                className={classes.menuItem}
              >
                <span className={classes.categoryIcon}>🏓</span>
                Padel Equipment
              </MenuItem>
            </Menu>
          </div>

          <Button
            component={Link}
            to="/about_us"
            className={classes.navButton}
          >
            About
          </Button>

          <Button
            component={Link}
            to="/contact"
            className={classes.navButton}
          >
            Contact Us
          </Button>

          {/* Cart with Badge */}
          <IconButton
            component={Link}
            to="/cart"
            className={classes.cartButton}
          >
            <Badge 
              badgeContent={cartItemsCount} 
              className={classes.cartBadge}
              overlap="rectangular"
            >
              <ShoppingCartIcon />
            </Badge>
          </IconButton>

          {/* Conditional Profile/Signup Button */}
          {isAuthenticated ? (
            <ProfileModal user={user} isAuthenticated={isAuthenticated} />
          ) : (
            <Button
              className={classes.signupButton}
              onClick={handleSignupClick}
            >
              Sign Up
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;