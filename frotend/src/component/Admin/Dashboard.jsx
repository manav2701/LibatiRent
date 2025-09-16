import React, { useState, useEffect } from "react";
import { BarChart, ShoppingCart, AssignmentInd, People } from "@material-ui/icons";
import { useSelector, useDispatch } from "react-redux";
import { getAdminProducts, clearErrors } from "../../actions/productAction";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import { getAllOrders } from "../../actions/orderAction";
import { getAllUsers } from "../../actions/userAction";
import Navbar from "./Navbar";
import Sidebar from "./Siderbar";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import ProductImg from "../../Image/admin/products.png";
import ordersImg from "../../Image/admin/order.png";
import usersImg from "../../Image/admin/user.png";

// Modern charts
import {
  LineChart as ReLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const GLASS_BG = "linear-gradient(135deg, rgba(237,28,36,0.85) 0%, rgba(60,0,20,0.7) 100%)";
const GLASS_BORDER = "1.5px solid rgba(237,28,36,0.25)";
const GLASS_SHADOW = "0 8px 32px 0 rgba(237,28,36,0.25)";
const GLASS_BLUR = "blur(18px)";

const useStyles = makeStyles((theme) => ({
  dashboard: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    width: "100%",
    minHeight: "100vh",
    gap: "1rem",
    margin: 0,
    padding: 0,
    background: GLASS_BG,
    backdropFilter: GLASS_BLUR,
    boxShadow: GLASS_SHADOW,
    position: "relative",
    overflow: "hidden",
  },
  firstBox: {
    width: "20%",
    margin: "0rem",
    height: "fit-content",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "18px",
    border: GLASS_BORDER,
    boxShadow: GLASS_SHADOW,
    display: "block",
    backdropFilter: GLASS_BLUR,
    [theme.breakpoints.down("999")]: {
      display: "none",
    },
  },
  toggleBox: {
    width: "16rem",
    margin: "0rem",
    height: "fit-content",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "18px",
    border: GLASS_BORDER,
    boxShadow: GLASS_SHADOW,
    display: "block",
    zIndex: "100",
    position: "absolute",
    top: "58px",
    left: "17px",
    backdropFilter: GLASS_BLUR,
  },
  secondBox: {
    width: "75%",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    justifyContent: "center",
    [theme.breakpoints.down("999")]: {
      width: "100%",
    },
  },
  navBar: {
    margin: "0rem",
  },
  summaryCard: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    gap: "2rem",
    margin: "2rem 0 0 0",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
      marginTop: "7rem !important",
      gap: "1.5rem",
    },
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255,255,255,0.12)",
    borderRadius: "18px",
    border: GLASS_BORDER,
    boxShadow: GLASS_SHADOW,
    width: "30%",
    height: "12rem",
    transition: "transform 0.2s, box-shadow 0.2s",
    cursor: "pointer",
    position: "relative",
    overflow: "hidden",
    backdropFilter: GLASS_BLUR,
    "&:hover": {
      transform: "scale(1.04)",
      boxShadow: "0 12px 32px 0 rgba(237,28,36,0.35)",
      background: "linear-gradient(135deg, #ed1c24 0%, #a8001c 100%)",
    },
    [theme.breakpoints.down("md")]: {
      width: "32%",
      height: "10rem",
    },
    [theme.breakpoints.down("sm")]: {
      width: "85%",
      height: "10rem",
    },
    [theme.breakpoints.down("xs")]: {
      width: "95%",
      height: "9rem",
    },
  },
  textContainer: {
    marginTop: "0.5rem",
    textAlign: "center",
    color: "#fff",
    textShadow: "0 2px 8px rgba(0,0,0,0.18)",
  },
  heading: {
    fontSize: "1.25rem",
    fontWeight: 800,
    marginBottom: "0.5rem",
    textShadow: "0 2px 8px rgba(0,0,0,0.18)",
    color: "#fff",
    letterSpacing: "0.02em",
    [theme.breakpoints.down("md")]: {
      fontSize: "1.1rem",
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "1.3rem",
    },
  },
  number: {
    fontSize: "2.2rem",
    fontWeight: 700,
    color: "#fff",
    textShadow: "0 2px 8px rgba(0,0,0,0.18)",
  },
  headerConetnt: {
    display: "flex",
    gap: "1rem",
    alignItems: "center",
    color: "#fff",
    [theme.breakpoints.down("md")]: {
      "& svg": {
        fontSize: "2rem",
      },
    },
    [theme.breakpoints.down("sm")]: {
      "& svg": {
        fontSize: "2.5rem",
      },
    },
  },
  revenue: {
    width: "100%",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "2rem",
    [theme.breakpoints.down("sm")]: {
      flexDirection: "column",
      alignItems: "center",
      gap: "2rem",
    },
  },
  doughnutChart: {
    background: "rgba(255,255,255,0.10)",
    borderRadius: "18px",
    border: GLASS_BORDER,
    boxShadow: GLASS_SHADOW,
    padding: "2rem 2rem",
    width: "45%",
    minWidth: 320,
    minHeight: 320,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: GLASS_BLUR,
    [theme.breakpoints.down("md")]: {
      width: "90%",
      minWidth: 0,
      minHeight: 0,
      padding: "1rem",
    },
    [theme.breakpoints.down("sm")]: {
      width: "85%",
      marginTop: "2rem",
    },
    [theme.breakpoints.down("xs")]: {
      width: "95%",
      marginBottom: "1rem",
      padding: "1.2rem",
    },
  },
  revnueContainer: {
    background: "rgba(255,255,255,0.10)",
    borderRadius: "18px",
    border: GLASS_BORDER,
    boxShadow: GLASS_SHADOW,
    width: "45%",
    minWidth: 320,
    minHeight: 320,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 2rem",
    backdropFilter: GLASS_BLUR,
    [theme.breakpoints.down("md")]: {
      width: "90%",
      minWidth: 0,
      minHeight: 0,
      padding: "1rem",
    },
    [theme.breakpoints.down("sm")]: {
      width: "85%",
      marginTop: "2rem",
    },
    [theme.breakpoints.down("xs")]: {
      width: "95%",
      marginBottom: "1rem",
      padding: "1.2rem",
    },
  },
  lineChart: {
    width: "100%",
    minHeight: 350,
    background: "rgba(255,255,255,0.10)",
    borderRadius: "18px",
    border: GLASS_BORDER,
    boxShadow: GLASS_SHADOW,
    padding: "2rem",
    margin: "1rem auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backdropFilter: GLASS_BLUR,
    [theme.breakpoints.down("sm")]: {
      width: "95%",
      minHeight: 220,
      padding: "1rem",
    },
  },
}));

function Dashboard() {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState(false);
  const { products, loading, error } = useSelector((state) => state.products);
  const { orders, error: ordersError } = useSelector((state) => state.allOrders);
  const { users, error: usersError } = useSelector((state) => state.allUsers);

  const alert = useAlert();

  // Defensive: ensure products is always an array
  const safeProducts = Array.isArray(products) ? products : [];

  // Pie chart: show stock availability for each product (label: product name, value: Stock)
  const pieData =
    safeProducts.length > 0
      ? safeProducts.map((item) => ({
          name: item.name,
          value: typeof item.Stock === "number" ? item.Stock : 0,
        }))
      : [];

  // Use a color palette for more than 2 products
  const pieColors = [
    "#00C49F", "#FF8042", "#0088FE", "#FFBB28", "#FF6384", "#36A2EB", "#FFCE56", "#8e44ad", "#e67e22", "#2ecc71"
  ];

  let totalStock = 0;
  let outOfStockCount = 0;
  let inStockCount = 0;

  safeProducts.forEach((item) => {
    const stock = typeof item.Stock === "number" ? item.Stock : 0;
    totalStock += stock;
    if (stock <= 0) {
      outOfStockCount += 1;
    } else {
      inStockCount += 1;
    }
  });

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors);
    }
    if (usersError) {
      alert.error(usersError);
      dispatch(clearErrors);
    }
    if (ordersError) {
      alert.error(ordersError);
      dispatch(clearErrors);
    }
    dispatch(getAllOrders());
    dispatch(getAllUsers());
    dispatch(getAdminProducts());
  }, [dispatch, error, alert, ordersError, usersError]);

  const toggleHandler = () => setToggle(!toggle);

  let totalAmount = 0;
  orders && orders.forEach((item) => {
    totalAmount += item.totalPrice;
  });

  const lineData = [
    { name: "Initial", amount: 0 },
    { name: "Earned", amount: totalAmount }
  ];

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 999 && toggle) {
        setToggle(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [toggle]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title="Dashboard - Admin Panel" />
          <div className={classes.dashboard}>
            <div
              className={
                !toggle ? `${classes.firstBox}` : `${classes.toggleBox}`
              }
            >
              <Sidebar />
            </div>

            <div className={classes.secondBox}>
              <div className={classes.navBar}>
                <Navbar toggleHandler={toggleHandler} />
              </div>

              <div className={classes.summaryCard}>
                <div
                  className={classes.cardContainer}
                  onClick={() => history.push("/admin/products")}
                  style={{
                    background: "rgba(255,255,255,0.13)",
                    border: GLASS_BORDER,
                    boxShadow: GLASS_SHADOW,
                  }}
                >
                  <div className={classes.headerConetnt}>
                    <ShoppingCart
                      fontSize="large"
                      style={{
                        fontSize: "2.5rem",
                        color: "#fff",
                        filter: "drop-shadow(0 2px 8px #ffffffaa)",
                      }}
                    />
                    <Typography variant="h6" className={classes.heading}>
                      Total Products
                    </Typography>
                  </div>
                  <div className={classes.textContainer}>
                    <Typography variant="body2" className={classes.number}>
                      {products && products.length}
                    </Typography>
                  </div>
                </div>

                <div
                  className={classes.cardContainer}
                  onClick={() => history.push("/admin/orders")}
                  style={{
                    background: "rgba(255,255,255,0.13)",
                    border: GLASS_BORDER,
                    boxShadow: GLASS_SHADOW,
                  }}
                >
                  <div className={classes.headerConetnt}>
                    <AssignmentInd
                      fontSize="large"
                      style={{
                        fontSize: "2.5rem",
                        color: "#fff",
                        filter: "drop-shadow(0 2px 8px #ffffffaa)",
                      }}
                    />
                    <Typography variant="h6" className={classes.heading}>
                      Total Orders
                    </Typography>
                  </div>
                  <div className={classes.textContainer}>
                    <Typography variant="body2" className={classes.number}>
                      {orders && orders.length}
                    </Typography>
                  </div>
                </div>

                <div
                  className={classes.cardContainer}
                  onClick={() => history.push("/admin/users")}
                  style={{
                    background: "rgba(255,255,255,0.13)",
                    border: GLASS_BORDER,
                    boxShadow: GLASS_SHADOW,
                  }}
                >
                  <div className={classes.headerConetnt}>
                    <People
                      fontSize="large"
                      style={{
                        fontSize: "2.5rem",
                        color: "#fff",
                        filter: "drop-shadow(0 2px 8px #ffffffaa)",
                      }}
                    />
                    <Typography variant="h6" className={classes.heading}>
                      Total Users
                    </Typography>
                  </div>
                  <div className={classes.textContainer}>
                    <Typography variant="body2" className={classes.number}>
                      {users && users.length}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className={classes.revenue}>
                <div
                  className={classes.doughnutChart}
                  style={{
                    zIndex: 10,
                    background: "rgba(255,255,255,0.10)",
                    minWidth: 320,
                    minHeight: 320,
                    width: 400,
                    height: 340,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div style={{ width: 320, height: 320, background: "transparent" }}>
                    <RePieChart width={320} height={320}>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={55}
                        fill="#ed1c24"
                        label={({ name, value }) =>
                          `${name}: ${value}`
                        }
                        stroke="#fff"
                        strokeWidth={2}
                        isAnimationActive={true}
                      >
                        {pieData.map((entry, idx) => (
                          <Cell key={`cell-${idx}`} fill={pieColors[idx % pieColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "rgba(255,255,255,0.95)",
                          border: "1px solid #ed1c24",
                          borderRadius: 12,
                          color: "#ed1c24",
                          fontWeight: 600,
                        }}
                      />
                      <Legend />
                    </RePieChart>
                  </div>
                </div>

                <div className={classes.revnueContainer}>
                  <div className={classes.headerConetnt}>
                    <BarChart
                      fontSize="large"
                      style={{
                        fontSize: "2.5rem",
                        color: "#fff",
                        filter: "drop-shadow(0 2px 8px #ffffffaa)",
                      }}
                    />
                    <Typography variant="h6" className={classes.heading}>
                      Total Revenue
                    </Typography>
                  </div>
                  <div className={classes.textContainer}>
                    <Typography variant="body2" className={classes.number}>
                      AED {totalAmount.toFixed(2)}
                    </Typography>
                  </div>
                </div>
              </div>

              <div className={classes.lineChart}>
                <ResponsiveContainer width="100%" height={300}>
                  <ReLineChart data={lineData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#fff" opacity={0.15} />
                    <XAxis dataKey="name" stroke="#fff" />
                    <YAxis stroke="#fff" />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(255,255,255,0.95)",
                        border: "1px solid #ed1c24",
                        borderRadius: 12,
                        color: "#ed1c24",
                        fontWeight: 600,
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="amount"
                      stroke="#fff"
                      strokeWidth={4}
                      dot={{ r: 8, fill: "#23272f", stroke: "#fff", strokeWidth: 3 }}
                      activeDot={{ r: 12, fill: "#fff", stroke: "#23272f", strokeWidth: 2 }}
                    />
                  </ReLineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Dashboard;