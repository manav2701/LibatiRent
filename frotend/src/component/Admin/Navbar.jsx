import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button } from "@material-ui/core";
import MenuIcon from "@mui/icons-material/Menu";
import { IconButton } from "@material-ui/core";
import { Link } from "react-router-dom";
import LibatiLogo from "../../Image/about/Libati.png";
import { useSelector } from "react-redux";
import ProfileModal from "../layouts/Header1.jsx/ProfileModel";

const useStyles = makeStyles((theme) => ({
  navbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 999,
    background: "transparent !important",

    width: "100%",
    padding: "1.5rem 1rem 1rem 1rem",
    boxShadow: "none !important",

    [theme.breakpoints.between("999")]: {
      flexDirection: "row",
      alignItems: "center",
      padding: "1rem",
    },
  },

  menuIcon: {
    display: "none",
    [theme.breakpoints.down("999")]: {
      display: "block",
      fontSize: "2rem",
      "& svg": {
        fontSize: "2rem",
        "&:hover": {
          color: "#ed1c24",
        },
      },
      "&:hover": {
        transform: "scale(1.1)", // Hover scale effect
      },
    },
  },
  dashboardHead: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.3s ease",

    // Responsive styles
    [theme.breakpoints.down("sm")]: {
      marginBottom: "0.5rem",
    },
    [theme.breakpoints.down("999")]: {
      marginBottom: 0,
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: "1.5rem",
    },
  },
  contactButton: {
    padding: "10px 30px",
    borderRadius: "20px",
    boxShadow: "0px 2px 8px 0px #0000000a",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: "16px",
    color: "#fff",
    letterSpacing: "1px",
    background: "#414141",
    transition: "background-color 0.3s",
    marginRight: "1rem", // reduced from 2rem to move left
    // Responsive styles
    [theme.breakpoints.down("sm")]: {
      fontSize: "14px",
      padding: "8px 14px",
    },
    [theme.breakpoints.between("sm", "md")]: {
      fontSize: "14px",
      padding: "7px 15px",
    },
    [theme.breakpoints.down("xs")]: {
      display: "none",
    },

    "&:hover": {
      background: "#ed1c24",
    },
  },
  headerBottom__logo_main: {
    height: "3.5rem",
    width: "auto",
    filter: "brightness(1.2) drop-shadow(0 4px 8px rgba(59, 130, 246, 0.5))",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
      filter: "brightness(1.3) drop-shadow(0 6px 12px rgba(59, 130, 246, 0.7))",
    },
    [theme.breakpoints.down("sm")]: {
      height: "3rem",
    },
    [theme.breakpoints.down("xs")]: {
      height: "2.5rem",
    },
  },
  logoLink: {
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.05)",
    },
  },
  // Add a style for the admin profile icon (white)
  adminProfileIcon: {
    marginLeft: "0.5rem",
    marginRight: "0.5rem",
    "& .profile-icon": {
      color: "#fff !important", // changed from #ed1c24
      background: "rgba(255,255,255,0.08) !important", // changed from red tint to white tint
      border: "1px solid #fff !important", // changed from #ed1c24
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    },
    "& .profile-icon:hover": {
      background: "#fff !important", // changed from #ed1c24
      color: "#23272f !important", // contrast text on white
    },
    // Ensure modal arrow is also white
    "& .arrow-icon": {
      color: "#fff !important", // changed from #ed1c24
    },
  },
}));

const Navbar = ({ toggleHandler }) => {
  const classes = useStyles();
  const { user, isAuthenticated } = useSelector((state) => state.userData || {});

  return (
    <nav className={classes.navbar}>
      <IconButton className={classes.menuIcon} onClick={toggleHandler}>
        <MenuIcon fontSize="2rem" />
      </IconButton>

      <div className={classes.dashboardHead}>
        <Link to="/admin/dashboard" className={classes.logoLink}>
          <img
            src={LibatiLogo}
            alt="Libati Admin Dashboard"
            className={classes.headerBottom__logo_main}
          />
        </Link>
      </div>

      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/contact" style={{ textDecoration: "none", color: "none" }}>
          <Button className={classes.contactButton}>Contact Us</Button>
        </Link>
        {/* ProfileModal in admin navbar, styled red */}
        <div className={classes.adminProfileIcon}>
          <ProfileModal user={user} isAuthenticated={isAuthenticated} />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;