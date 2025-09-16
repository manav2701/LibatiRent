import React from "react";
import { Link , useHistory } from "react-router-dom";
import { Avatar, Typography, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PostAddIcon from "@mui/icons-material/PostAdd";
import AddIcon from "@mui/icons-material/Add";
import ListAltIcon from "@mui/icons-material/ListAlt";
import RateReviewIcon from "@mui/icons-material/RateReview";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import HomeIcon from "@mui/icons-material/Home";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import { useSelector } from "react-redux";
const useStyles = makeStyles((theme) => ({
  sidebar: {
    background: "linear-gradient(135deg, rgba(237,28,36,0.85) 0%, rgba(60,0,20,0.7) 100%)",
    backdropFilter: "blur(18px)",
    border: "1.5px solid rgba(237,28,36,0.25)",
    boxShadow: "0 8px 32px 0 rgba(237,28,36,0.25)",
    borderRadius: "18px",
    padding: "2rem 0",
    margin: "0 auto",
    width: "100%",
    color: "#fff",
    position: "relative",
    overflow: "hidden",
  },
  avatar11: {
    width: "80px",
    height: "80px",
    border: "4px solid #fff",
    margin: "0 auto",
    marginBottom: "1rem",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 12px 0 rgba(237,28,36,0.18)",
    background: "rgba(255,255,255,0.08)",
  },
  name: {
    fontWeight: "600",
    textAlign: "center",
    fontSize: "1.1rem",
    color: "#fff",
    letterSpacing: "0.01em",
    textShadow: "0 2px 8px rgba(0,0,0,0.18)",
  },
  email: {
    color: "#ffeaea",
    marginBottom: "1.5rem",
    textAlign: "center",
    fontSize: "0.95rem",
    textShadow: "0 2px 8px rgba(0,0,0,0.12)",
  },
  divider: {
    height: "2px",
    width: "75%",
    background: "linear-gradient(90deg, transparent, #ed1c24 60%, transparent)",
    margin: "2rem auto",
    border: "none",
  },
  button: {
    marginLeft: "2rem !important",
    boxShadow: "0 0 10px rgba(237,28,36,0.18)",
    background: "#ed1c24 !important",
    color: "#fff !important",
    width: "70% !important",
    padding: "0.8rem 2rem !important",
    borderRadius: "12px !important",
    fontWeight: 700,
    fontSize: "1rem",
    letterSpacing: "0.02em",
    transition: "all 0.2s",
    "&:hover": {
      background: "#a8001c !important",
      color: "#fff !important",
      boxShadow: "0 0 18px 0 #ed1c24",
    },
  },
  sideBarMenu: {
    listStyleType: "none",
    padding: 0,
    margin: "3rem 10px",
    width: "100%",
  },
  sideBarMenuItem: {
    display: "flex",
    alignItems: "center",
    padding: "0.9rem 1rem",
    borderRadius: "12px",
    marginTop: "1.3rem",
    width: "85%",
    background: "rgba(255,255,255,0.06)",
    boxShadow: "0 2px 8px rgba(237,28,36,0.10)",
    transition: "all 0.2s",
    "&:hover": {
      background: "linear-gradient(90deg, #ed1c24 60%, #a8001c 100%)",
      boxShadow: "0 4px 16px rgba(237,28,36,0.18)",
      "& svg": {
        color: "#fff",
      },
      "& span": {
        color: "#fff !important",
      },
    },
    "& svg": {
      color: "#fff",
      fontSize: "26px",
      margin: "0 20px 0 0",
      filter: "drop-shadow(0 2px 8px #ed1c24aa)",
      transition: "color 0.2s",
    },
    "& span": {
      color: "#fff",
      fontSize: "1rem",
      fontWeight: "600",
      marginLeft: "1rem",
      textDecoration: "none",
      transition: "color 0.2s",
      letterSpacing: "0.01em",
      textShadow: "0 2px 8px rgba(0,0,0,0.10)",
    },
  },
}));

function Sidebar() {
  const classes = useStyles();
  const { user, loading } = useSelector((state) => state.userData); 


  const history = useHistory();

function accountHandler() {

  history.push("/account");
}

  return (
    <>
      {!loading && (
        <>
          <div className={classes.sidebar}>
            <Avatar
              src={user && user.avatar.url}
              alt="User Avatar"
              className={classes.avatar11}
            />
            <Typography variant="subtitle1" className={classes.name}>
              {user && user.name}
            </Typography>
            <Typography variant="subtitle2" className={classes.email}>
              {user && user.email}
            </Typography>
            <div className={classes.divider} />
            <ul className={classes.sideBarMenu}>
              <Link
                to="/admin/dashboard"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <li className={classes.sideBarMenuItem}>
                  <DashboardIcon fontSize="large" />
                  <span className={classes.sideBarMenuItem_text}>
                    {" "}
                    Dashboard
                  </span>
                </li>
              </Link>

              <Link to="/" style={{ color: "inherit", textDecoration: "none" }}>
                <li className={classes.sideBarMenuItem}>
                  <HomeIcon fontSize="large" />
                  <span className={classes.sideBarMenuItem_text}>Home</span>
                </li>
              </Link>

              <Link
                to="/admin/products"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <li className={classes.sideBarMenuItem}>
                  <PostAddIcon fontSize="large" />

                  <span className={classes.sideBarMenuItem_text}>
                    {" "}
                    Products
                  </span>
                </li>
              </Link>
              <Link
                to="/admin/new/product"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <li className={classes.sideBarMenuItem}>
                  <AddIcon fontSize="large" />
                  <span className={classes.sideBarMenuItem_text}>
                    Add Product
                  </span>
                </li>
              </Link>

              <Link
                to="/admin/orders"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <li className={classes.sideBarMenuItem}>
                  <ListAltIcon fontSize="large" />
                  <span className={classes.sideBarMenuItem_text}>Orders</span>
                </li>
              </Link>
              <Link
                to="/admin/reviews"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <li className={classes.sideBarMenuItem}>
                  <RateReviewIcon fontSize="large" />
                  <span className={classes.sideBarMenuItem_text}>Reviews</span>
                </li>
              </Link>

              <Link
                to="/contact"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <li className={classes.sideBarMenuItem}>
                  <ContactPageIcon fontSize="large" />
                  <span className={classes.sideBarMenuItem_text}>Contact</span>
                </li>
              </Link>
            </ul>
            <div className={classes.divider} />
            <Button
              className={classes.button}
              onClick={accountHandler}
              variant="contained"
            >
              <ManageAccountsIcon
                fontSize="large"
                style={{ marginRight: "10px" }}
              />
              Account
            </Button>
          </div>
        </>
      )}
    </>
  );
}

export default Sidebar;
