// Products.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import "./Products.css";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../layouts/loader/Loader";
import { useAlert } from "react-alert";
import { useRouteMatch, useLocation } from "react-router-dom";
import MetaData from "../layouts/MataData/MataData";
import { clearErrors, getProduct } from "../../actions/productAction";
import { addItemToCart } from "../../actions/cartAction";
import MyCard from "./Card";
import Pagination from "react-js-pagination";
import Slider from "@mui/material/Slider";
import { Typography } from "@mui/material";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InventoryIcon from "@mui/icons-material/Inventory";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import MCard from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import Fade from "@mui/material/Fade";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const categoryTabs = [
  { id: "all", label: "All Equipment", icon: "🏆" },
  { id: "Tennis", label: "Tennis", icon: "🎾" },
  { id: "Padel", label: "Padel", icon: "🏓" },
  { id: "Golf", label: "Golf", icon: "⛳" },
];

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 6; hour <= 23; hour++) {
    options.push(`${hour.toString().padStart(2, "0")}:00`);
    options.push(`${hour.toString().padStart(2, "0")}:30`);
  }
  return options;
};

function Products() {
  const match = useRouteMatch();
  const location = useLocation();
  const dispatch = useDispatch();
  const alert = useAlert();

  // Redux products slice
  const {
    products,
    loading,
    productsCount,
    error,
    resultPerPage,
    filterdProductCount,
  } = useSelector((state) => state.products);

  // URL derived values
  const getKeywordFromUrl = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("keyword") || (match && match.params && match.params.keyword) || "";
  }, [location.search, match]);

  const getCategoryFromUrl = useCallback(() => {
    const urlParams = new URLSearchParams(location.search);
    return urlParams.get("category") || "";
  }, [location.search]);

  const [keyword, setKeyword] = useState(getKeywordFromUrl());

  // Rental configuration modal state
  const [isRentalConfigOpen, setIsRentalConfigOpen] = useState(false);

  // Pagination and filters
  const [currentPage, setCurrentPage] = useState(1);
  const [price, setPrice] = useState([0, 100000]);
  const [category, setCategory] = useState(getCategoryFromUrl());
  const [ratings, setRatings] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(getCategoryFromUrl());
  const [selectedRating, setSelectedRating] = useState("all");
  const [activeTab, setActiveTab] = useState(() => {
    const urlCategory = getCategoryFromUrl();
    if (urlCategory === "Tennis") return "Tennis";
    if (urlCategory === "Padel") return "Padel";
    return "All Equipment";
  });

  // Rental configuration (no defaults)
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [isConfigurationApplied, setIsConfigurationApplied] = useState(false);

  // Extra filter state (example)
  const [filterOptions, setFilterOptions] = useState({
    tennis: { brands: [], headSizes: [], gripSizes: [] },
    padel: { brands: [], shapes: [] },
  });

  const [tennisBrand, setTennisBrand] = useState("");
  const [tennisHeadSize, setTennisHeadSize] = useState("");
  const [tennisGripSize, setTennisGripSize] = useState("");
  const [padelBrand, setPadelBrand] = useState("");
  const [padelShape, setPadelShape] = useState("");

  const timeOptions = generateTimeOptions();

  // Sync URL-derived filters
  useEffect(() => {
    setKeyword(getKeywordFromUrl());
    setCategory(getCategoryFromUrl());
    setSelectedCategory(getCategoryFromUrl());
  }, [getKeywordFromUrl, getCategoryFromUrl]);

  // Restore rental config from localStorage if any
  useEffect(() => {
    const cached = localStorage.getItem("rentalConfig");
    if (cached) {
      try {
        const obj = JSON.parse(cached);
        // Only set config if ALL fields are present and non-empty
        if (
          obj.pickupDate && obj.pickupTime &&
          obj.returnDate && obj.returnTime
        ) {
          setPickupDate(obj.pickupDate);
          setPickupTime(obj.pickupTime);
          setReturnDate(obj.returnDate);
          setReturnTime(obj.returnTime);
          setIsConfigurationApplied(true);
        } else {
          setPickupDate("");
          setPickupTime("");
          setReturnDate("");
          setReturnTime("");
          setIsConfigurationApplied(false);
        }
      } catch (e) {
        setPickupDate("");
        setPickupTime("");
        setReturnDate("");
        setReturnTime("");
        setIsConfigurationApplied(false);
      }
    } else {
      setPickupDate("");
      setPickupTime("");
      setReturnDate("");
      setReturnTime("");
      setIsConfigurationApplied(false);
    }
  }, []);

  // Persist rental config
  useEffect(() => {
    // Only persist if all fields are set, otherwise clear from storage
    if (pickupDate && pickupTime && returnDate && returnTime) {
      localStorage.setItem(
        "rentalConfig",
        JSON.stringify({
          pickupDate,
          pickupTime,
          returnDate,
          returnTime,
        })
      );
    } else {
      localStorage.removeItem("rentalConfig");
    }
  }, [pickupDate, pickupTime, returnDate, returnTime]);

  // Fetch filter options from backend (example)
  useEffect(() => {
    async function fetchFilters() {
      try {
        const res = await fetch("/api/v1/products/filters");
        const data = await res.json();
        if (data && data.success) setFilterOptions(data);
      } catch (e) {
        console.error("Error fetching filters:", e);
      }
    }
    fetchFilters();
  }, []);

  // Track if rental config was just applied (to force refetch)
  const [rentalConfigAppliedAt, setRentalConfigAppliedAt] = useState(Date.now());

  // Fetch products when filters or rental config change
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    const specificFilters = {};
    if (selectedCategory === "Tennis") {
      if (tennisBrand) specificFilters.tennisBrand = tennisBrand;
      if (tennisHeadSize) specificFilters.headSize = tennisHeadSize;
      if (tennisGripSize) specificFilters.gripSize = tennisGripSize;
    } else if (selectedCategory === "Padel") {
      if (padelBrand) specificFilters.padelBrand = padelBrand;
      if (padelShape) specificFilters.padelShape = padelShape;
    }

    // Always include rental config in filters if applied
    if (isConfigurationApplied && pickupDate && pickupTime && returnDate && returnTime) {
      specificFilters.pickupDate = pickupDate;
      specificFilters.pickupTime = pickupTime;
      specificFilters.returnDate = returnDate;
      specificFilters.returnTime = returnTime;
    }

    dispatch(getProduct(keyword, currentPage, price, category, ratings, specificFilters));
  }, [
    dispatch,
    alert,
    error,
    keyword,
    currentPage,
    price,
    ratings,
    category,
    tennisBrand,
    tennisHeadSize,
    tennisGripSize,
    padelBrand,
    padelShape,
    selectedCategory,
    isConfigurationApplied,
    pickupDate,
    pickupTime,
    returnDate,
    returnTime,
    rentalConfigAppliedAt,
  ]);

  // Pagination handler
  const setCurrentPageNoHandler = (e) => setCurrentPage(e);

  const priceHandler = (event, newPrice) => setPrice(newPrice);

  const handleRatingChange = (event) => {
    setRatings(event.target.value);
    setSelectedRating(event.target.value);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCategory(tabId === "all" ? "" : tabId);
    setSelectedCategory(tabId === "all" ? "" : tabId);
    setCurrentPage(1);
  };

  const showAllProductsHandler = () => {
    setPrice([0, 100000]);
    setCategory("");
    setRatings(0);
    setSelectedRating("all");
    setSelectedCategory("");
    setActiveTab("All Equipment");
    setCurrentPage(1);
    setKeyword("");
    setIsConfigurationApplied(false);
    setTennisBrand("");
    setTennisHeadSize("");
    setTennisGripSize("");
    setPadelBrand("");
    setPadelShape("");
    dispatch(getProduct("", 1, [0, 100000], "", 0));
  };

  // Add-to-cart handler used by Card.jsx
  const handleAddToCart = (product, rentalCfg) => {
    // Ensure rental config applied
    if (!isConfigurationApplied || !pickupDate || !pickupTime || !returnDate || !returnTime) {
      setIsRentalConfigOpen(true);
      alert.info("Please select pickup and return date/time first.");
      return;
    }

    // Use Redux action to add to cart (not localStorage directly)
    dispatch(
      addItemToCart(
        product._id,
        1,
        {
          rentalConfig: rentalCfg || {
            pickupDate,
            pickupTime,
            returnDate,
            returnTime,
          }
        }
      )
    );
    alert.success("Added to cart with rental info!");
  };

  // Handler for applying rental config
  const handleApplyRentalConfig = () => {
    if (!pickupDate || !pickupTime || !returnDate || !returnTime) {
      alert.error("Please select pickup and return date and time");
      return;
    }
    const pickup = new Date(`${pickupDate}T${pickupTime}:00+04:00`);
    const ret = new Date(`${returnDate}T${returnTime}:00+04:00`);
    if (pickup >= ret) {
      alert.error("Return time must be after pickup time");
      return;
    }
    setIsConfigurationApplied(true);
    setIsRentalConfigOpen(false);
    setCurrentPage(1);
    setRentalConfigAppliedAt(Date.now());
    alert.success("Rental configuration applied! Showing available equipment.");
  };

  const resetRentalConfig = () => {
    setIsConfigurationApplied(false);
    setPickupDate("");
    setPickupTime("");
    setReturnDate("");
    setReturnTime("");
    localStorage.removeItem("rentalConfig");
    setCurrentPage(1);
    alert.info("Rental configuration cleared. Showing all equipment.");
  };

  const formatDubaiCompact = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return "";
    try {
      const dt = new Date(`${dateStr}T${timeStr}:00+04:00`);
      return dt.toLocaleString("en-GB", {
        timeZone: "Asia/Dubai",
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return `${dateStr} ${timeStr}`;
    }
  };

  const getCompactDisplayText = () => {
    if (!isConfigurationApplied) {
      return "Click to set rental dates & times";
    }
    return `${formatDubaiCompact(pickupDate, pickupTime)} → ${formatDubaiCompact(returnDate, returnTime)}`;
  };

  const openRentalConfigModal = () => setIsRentalConfigOpen(true);

  // ---------------------------
  // SCROLL LOCK / PREVENT JUMP
  // ---------------------------
  // We manage body lock manually to prevent layout shift when modal opens/closes.
  const scrollYRef = useRef(0);
  useEffect(() => {
    const lock = () => {
      scrollYRef.current = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.left = "0";
      document.body.style.right = "0";
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    };

    const unlock = () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollYRef.current);
    };

    if (isRentalConfigOpen) {
      lock();
    } else {
      unlock();
    }

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.left = "";
      document.body.style.right = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isRentalConfigOpen]);

  // ---------------------------
  // UI Rendering (same as before)
  // ---------------------------
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData
            title={
              keyword ? `Search: ${keyword} - Libati Sports Rental` : "PRODUCTS - Libati Sports Rental"
            }
          />

          {/* Compact rental config bar */}
          <div className="rental-compact-bar">
            <Button
              variant="contained"
              onClick={() => setIsRentalConfigOpen(true)}
              className="compact-rental-button"
              startIcon={
                <CalendarTodayIcon style={{ width: 36, height: 36 }} />
              }
              style={{
                background: isConfigurationApplied
                  ? "linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                  : "var(--bg-primary)",
              }}
            >
              <div className="compact-rental-text" style={{ textTransform: "none", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                <span className="duration-label" style={{ fontWeight: 700 }}>
                  {isConfigurationApplied ? `Rental - ACTIVE` : "Set Rental Dates & Times"}
                </span>
                <span className="date-time-display" style={{ fontSize: 12 }}>
                  {getCompactDisplayText()}
                </span>
              </div>
            </Button>

            {isConfigurationApplied && (
              <Button
                variant="outlined"
                onClick={resetRentalConfig}
                style={{ marginLeft: 16, borderColor: "#f44336", color: "#f44336" }}
              >
                Clear Config
              </Button>
            )}
          </div>

          {/* Rental Modal */}
          <Modal
            open={isRentalConfigOpen}
            onClose={() => setIsRentalConfigOpen(false)}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
              style: { backgroundColor: "rgba(0, 0, 0, 0.6)" },
            }}
            disableScrollLock={true}
            disableAutoFocus={true}
            disableEnforceFocus={true}
          >
            <Fade in={isRentalConfigOpen}>
              <div
                className="rental-modal"
                style={{
                  position: "fixed",
                  top: "13%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 1500,
                  maxHeight: "95vh",
                  overflowY: "auto",
                  width: "min(480px, 96vw)",
                  margin: 0,
                  padding: 0,
                  background: "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MCard className="rental-modal-card">
                  <CardContent>
                    <div className="modal-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <Typography variant="h5" style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <CalendarTodayIcon /> Configure Your Rental
                      </Typography>
                      <IconButton onClick={() => setIsRentalConfigOpen(false)} aria-label="close-modal">
                        <CloseIcon />
                      </IconButton>
                    </div>

                    <Grid container spacing={3} className="rental-form" style={{ marginTop: 8 }}>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" className="field-label">Pickup Date *</Typography>
                        <TextField
                          variant="outlined"
                          type="date"
                          fullWidth
                          value={pickupDate}
                          onChange={(e) => setPickupDate(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: new Date().toISOString().split("T")[0] }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" className="field-label">Pickup Time *</Typography>
                        <Select
                          variant="outlined"
                          fullWidth
                          value={pickupTime}
                          onChange={(e) => setPickupTime(e.target.value)}
                        >
                          <MenuItem value="">Select time</MenuItem>
                          {timeOptions.map((t) => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                          ))}
                        </Select>
                      </Grid>

                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" className="field-label">Return Date *</Typography>
                        <TextField
                          variant="outlined"
                          type="date"
                          fullWidth
                          value={returnDate}
                          onChange={(e) => setReturnDate(e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          inputProps={{ min: pickupDate || new Date().toISOString().split("T")[0] }}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Typography variant="body1" className="field-label">Return Time *</Typography>
                        <Select
                          variant="outlined"
                          fullWidth
                          value={returnTime}
                          onChange={(e) => setReturnTime(e.target.value)}
                        >
                          <MenuItem value="">Select time</MenuItem>
                          {timeOptions.map((t) => (
                            <MenuItem key={t} value={t}>{t}</MenuItem>
                          ))}
                        </Select>
                      </Grid>

                      <Grid item xs={12}>
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={handleApplyRentalConfig}
                          className="apply-rental-button"
                          size="large"
                          startIcon={<AccessTimeIcon />}
                        >
                          Apply Rental Configuration
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </MCard>
              </div>
            </Fade>
          </Modal>

          {/* Products grid + sidebar */}
          <div className="products-layout" style={{ display: "flex", gap: 24, padding: "1.5rem" }}>
            <aside className="sidebar" style={{ width: 280 }}>
              {/* Sidebar content */}
              <div style={{ marginBottom: 16 }}>
                <Typography variant="subtitle1" gutterBottom>Categories</Typography>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {["All", "Tennis", "Padel", "Golf"].map((c) => (
                    <Button
                      key={c}
                      variant={selectedCategory === c || (c === "All" && !selectedCategory) ? "contained" : "outlined"}
                      onClick={() => {
                        setSelectedCategory(c === "All" ? "" : c);
                        setCategory(c === "All" ? "" : c);
                        setTennisBrand("");
                        setTennisHeadSize("");
                        setTennisGripSize("");
                        setPadelBrand("");
                        setPadelShape("");
                      }}
                    >
                      {c}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Filters as before */}
              {selectedCategory === "Tennis" && (
                <div style={{ marginTop: 16 }}>
                  <Typography variant="subtitle1">Tennis Filters</Typography>
                  <Select fullWidth value={tennisBrand} onChange={(e) => setTennisBrand(e.target.value)} displayEmpty>
                    <MenuItem value="">All Brands</MenuItem>
                    {(filterOptions.tennis?.brands || []).map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                  </Select>
                  <Select fullWidth value={tennisHeadSize} onChange={(e) => setTennisHeadSize(e.target.value)} displayEmpty style={{ marginTop: 8 }}>
                    <MenuItem value="">All Head Sizes</MenuItem>
                    {(filterOptions.tennis?.headSizes || []).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                  <Select fullWidth value={tennisGripSize} onChange={(e) => setTennisGripSize(e.target.value)} displayEmpty style={{ marginTop: 8 }}>
                    <MenuItem value="">All Grip Sizes</MenuItem>
                    {(filterOptions.tennis?.gripSizes || []).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </div>
              )}

              {selectedCategory === "Padel" && (
                <div style={{ marginTop: 16 }}>
                  <Typography variant="subtitle1">Padel Filters</Typography>
                  <Select fullWidth value={padelBrand} onChange={(e) => setPadelBrand(e.target.value)} displayEmpty>
                    <MenuItem value="">All Brands</MenuItem>
                    {(filterOptions.padel?.brands || []).map((b) => <MenuItem key={b} value={b}>{b}</MenuItem>)}
                  </Select>
                  <Select fullWidth value={padelShape} onChange={(e) => setPadelShape(e.target.value)} displayEmpty style={{ marginTop: 8 }}>
                    <MenuItem value="">All Shapes</MenuItem>
                    {(filterOptions.padel?.shapes || []).map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
                  </Select>
                </div>
              )}
            </aside>

            <main className="products-main" style={{ flex: 1 }}>
              <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 20 }}>
                {products && products.length > 0 ? (
                  products.map((product) => (
                    <MyCard
                      key={product._id}
                      product={product}
                      rentalConfig={
                        isConfigurationApplied && pickupDate && pickupTime && returnDate && returnTime
                          ? { pickupDate, pickupTime, returnDate, returnTime, isApplied: true }
                          : null
                      }
                      rentalPrice={product.rentalPrice}
                      isRentalConfigApplied={isConfigurationApplied && pickupDate && pickupTime && returnDate && returnTime}
                      stock={product.Stock}
                      onRequireRentalConfig={openRentalConfigModal}
                      onAddToCart={handleAddToCart}
                    />
                  ))
                ) : (
                  <div className="empty-state" style={{ padding: 40, textAlign: "center" }}>
                    <InventoryIcon style={{ fontSize: 48, color: "#9aa0a6" }} />
                    <Typography variant="h5" style={{ marginTop: 12 }}>
                      {keyword ? `No Equipment Found for "${keyword}"` : "No Equipment Found"}
                    </Typography>
                    <Typography variant="body1" style={{ marginTop: 8 }}>
                      {keyword
                        ? `No equipment matches your search "${keyword}". Try different keywords or browse all equipment.`
                        : "No equipment available for your selected criteria."}
                    </Typography>
                    <Button variant="contained" onClick={showAllProductsHandler} style={{ marginTop: 12 }}>
                      {keyword ? "Clear Search & Show All Equipment" : "Show All Equipment"}
                    </Button>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {resultPerPage < filterdProductCount && (
                <div className="pagination-container" style={{ marginTop: 24, display: "flex", justifyContent: "center" }}>
                  <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={resultPerPage}
                    totalItemsCount={filterdProductCount}
                    onChange={setCurrentPageNoHandler}
                    nextPageText="Next"
                    prevPageText="Prev"
                    firstPageText="First"
                    lastPageText="Last"
                    itemClass="page-item"
                    linkClass="page-link"
                    activeClass="page-item-active"
                    activeLinkClass="page-link-active"
                  />
                </div>
              )}
            </main>
          </div>
        </>
      )}
    </>
  );
}

export default Products;
