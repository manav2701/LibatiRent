import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import MetaData from "../layouts/MataData/MataData";
import Loader from "../layouts/loader/Loader";
import Sidebar from "./Siderbar";
import { createProduct, clearErrors } from "../../actions/productAction";
import { useHistory } from "react-router-dom";
import { NEW_PRODUCT_RESET } from "../../constants/productsConstatns";
import InputAdornment from "@material-ui/core/InputAdornment";
import Box from "@material-ui/core/Box";
import StorageIcon from "@material-ui/icons/Storage";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CollectionsIcon from "@mui/icons-material/Collections";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InfoIcon from "@mui/icons-material/Info";
import Navbar from "./Navbar";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  TextField,
  Typography,
  FormControl,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";

/**
 * NewProduct (updated)
 * - Fixed dropdown jump-to-top by removing preventDefault/blur and adding MenuProps
 * - Full component returned so you can drop it in
 */

// Add/override theme for glassmorphism and increase form width
const useAdminProductStyles = makeStyles((theme) => ({
  updateProduct: {
    minHeight: "100vh",
    width: "100vw",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "1rem",
    margin: 0,
    padding: 0,
    background:
      "linear-gradient(135deg, rgba(237,28,36,0.85) 0%, rgba(60,0,20,0.7) 100%)",
    backdropFilter: "blur(18px)",
    boxShadow: "0 8px 32px 0 rgba(237,28,36,0.25)",
    position: "relative",
    overflow: "hidden",
  },
  firstBox1: {
    width: "20%",
    margin: "0rem",
    height: "fit-content",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "18px",
    border: "1.5px solid rgba(237,28,36,0.25)",
    boxShadow: "0 8px 32px 0 rgba(237,28,36,0.25)",
    display: "block",
    backdropFilter: "blur(18px)",
    [theme.breakpoints.down("999")]: {
      display: "none",
    },
  },
  toggleBox1: {
    width: "16rem",
    margin: "0rem",
    height: "fit-content",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "18px",
    border: "1.5px solid rgba(237,28,36,0.25)",
    boxShadow: "0 8px 32px 0 rgba(237,28,36,0.25)",
    display: "block",
    zIndex: "100",
    position: "absolute",
    top: "58px",
    left: "17px",
    backdropFilter: "blur(18px)",
  },
  secondBox1: {
    width: "80%",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    gap: "2rem",
    justifyContent: "center",
    [theme.breakpoints.down("999")]: {
      width: "100%",
    },
  },
  navBar1: {
    margin: "0rem",
  },
  formContainer: {
    background: "rgba(255,255,255,0.10)",
    borderRadius: "18px",
    border: "1.5px solid rgba(255, 255, 255, 1)",
    boxShadow: "0 8px 32px 0 rgba(238, 238, 238, 1)",
    color: "#fff",
    width: "100%",
    maxWidth: "1400px", // Increased width
    margin: "0 auto",
    padding: "2.5rem 2.5rem",
    [theme.breakpoints.down("md")]: {
      maxWidth: "98vw",
      padding: "1.2rem",
    },
  },
  formContainer2: {
    // For extra specificity if needed
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  form: {
    width: "100%",
    color: "#fff",
  },
  form2: {
    width: "100%",
  },
  heading: {
    color: "#fff",
    fontWeight: 700,
    fontSize: "2.2rem",
    marginBottom: "1.5rem",
    textShadow: "0 2px 8px rgba(0,0,0,0.18)",
    letterSpacing: "0.02em",
  },
  avatar: {
    margin: "0 auto 1.5rem auto",
    background: "#ed1c24",
    color: "#fff",
    width: 64,
    height: 64,
    boxShadow: "0 2px 12px 0 rgba(237,28,36,0.18)",
  },
  textField: {
    margin: "1rem 0",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "8px",
    color: "#fff",
    "& .MuiInputBase-root": {
      color: "#fff",
      fontSize: "1rem",
      borderRadius: "8px",
      background: "rgba(255,255,255,0.08)",
      // Make all input boxes the same height and border
      minHeight: "48px",
      boxSizing: "border-box",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#fff",
      borderWidth: "2px",
    },
    "& .MuiInputLabel-root": {
      color: "#fff",
    },
    "& .MuiInputLabel-outlined": {
      color: "#fff",
    },
    "& .MuiSelect-root": {
      color: "#fff",
    },
    "& .MuiSelect-icon": {
      color: "#fff",
    },
    "& .MuiInputAdornment-root": {
      color: "#fff",
    },
    "& .MuiFormLabel-root": {
      color: "#fff",
    },
    "& .MuiFormHelperText-root": {
      color: "#fff",
    },
    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
    // Make all input fields and selects consistent
    "& input, & .MuiSelect-root, & .MuiInputBase-input": {
      minHeight: "48px",
      fontSize: "1rem",
      padding: "12px 14px",
      boxSizing: "border-box",
    },
  },
  loginButton: {
    background: "#ed1c24 !important",
    color: "#fff !important",
    fontWeight: 700,
    fontSize: "1.1rem",
    borderRadius: "12px !important",
    marginTop: "2rem",
    padding: "1rem",
    transition: "all 0.2s",
    "&:hover": {
      background: "#a8001c !important",
      color: "#fff !important",
      boxShadow: "0 0 18px 0 #ed1c24",
    },
  },
  // Make all Typography white by default
  "@global": {
    ".MuiTypography-root": {
      color: "#fff !important",
    },
    ".MuiFormLabel-root": {
      color: "#fff !important",
    },
    ".MuiInputLabel-root": {
      color: "#fff !important",
    },
    ".MuiSelect-root": {
      color: "#fff !important",
    },
    ".MuiSelect-icon": {
      color: "#fff !important",
    },
    ".MuiInputAdornment-root": {
      color: "#fff !important",
    },
    ".MuiSvgIcon-root": {
      color: "#fff !important",
    },
    ".MuiFormHelperText-root": {
      color: "#fff !important",
    },
    ".MuiOutlinedInput-input": {
      color: "#fff !important",
    },
    ".MuiInputBase-input": {
      color: "#fff !important",
    },
    ".MuiMenuItem-root": {
      color: "#fff !important",
    },
    ".MuiButton-label": {
      color: "#fff !important",
    },
  },
  // ...other styles as needed...
}));

function NewProduct() {
  const dispatch = useDispatch();
  const history = useHistory();
  const alert = useAlert();

  const { loading, error, success } = useSelector(
    (state) => state.addNewProduct
  );

  // Basic Information
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [sku, setSku] = useState("");
  const [Stock, setStock] = useState(0);
  const [keyFeatures, setKeyFeatures] = useState("");
  const [info, setInfo] = useState("");
  const [location, setLocation] = useState("Dubai, UAE");

  // Sports Category
  const [sportsCategory, setSportsCategory] = useState("");

  // Rental Pricing
  const [firstHourPrice, setFirstHourPrice] = useState(0);
  const [subsequentHourPrice, setSubsequentHourPrice] = useState(100);

  // Tennis Specifications
  const [tennisSpecs, setTennisSpecs] = useState({
    brand: "",
    headSize: "",
    gripSize: "",
    stringPattern: "",
    unstrungWeight: "",
    length: 27,
  });

  // Padel Specifications
  const [padelSpecs, setPadelSpecs] = useState({
    brand: "",
    weight: "",
    shape: "",
    balance: "",
    coreMaterial: "",
    surface: "",
  });

  // Free Items
  const [freeItems, setFreeItems] = useState([
    {
      name: "",
      quantity: 1,
      description: "",
    },
  ]);

  // Availability - Changed to use simple date strings instead of Date objects
  const [availability, setAvailability] = useState({
    availableFrom: {
      date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      time: "09:00",
    },
    availableTo: {
      date: new Date().toISOString().split("T")[0], // Format: YYYY-MM-DD
      time: "21:00",
    },
  });

  // Legacy fields for compatibility
  const [category, setCategory] = useState("");
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [isCategory, setIsCategory] = useState(false);
  const fileInputRef = useRef();
  const [toggle, setToggle] = useState(false);

  const classes = useAdminProductStyles();

  const toggleHandler = () => {
    setToggle(!toggle);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setIsCategory(true);
  };

  const handleSportsCategoryChange = (e) => {
    setSportsCategory(e.target.value);
    // Reset specifications when category changes
    setTennisSpecs({
      brand: "",
      headSize: "",
      gripSize: "",
      stringPattern: "",
      unstrungWeight: "",
      length: 27,
    });
    setPadelSpecs({
      brand: "",
      weight: "",
      shape: "",
      balance: "",
      coreMaterial: "",
      surface: "",
    });
  };

  const handleImageUpload = () => {
    fileInputRef.current.click();
  };

  const handleAddFreeItem = () => {
    setFreeItems([...freeItems, { name: "", quantity: 1, description: "" }]);
  };

  const handleRemoveFreeItem = (index) => {
    setFreeItems(freeItems.filter((_, i) => i !== index));
  };

  const handleFreeItemChange = (index, field, value) => {
    const updatedItems = [...freeItems];
    updatedItems[index][field] = value;
    setFreeItems(updatedItems);
  };

  const categories = [
    "Tennis",
    "Padel",
    "Golf",
    "Beach Tennis",
    "Accessories",
  ];

  const sportsCategories = ["Tennis", "Padel", "Golf", "Beach Tennis"];

  const tennisbrands = ["Babolat", "Head", "Tecnifibre", "Wilson", "Yonex"];
  const padelBrands = ["Adidas", "Nox", "Head"];

  const timeOptions = [];
  for (let i = 6; i <= 23; i++) {
    timeOptions.push(`${i.toString().padStart(2, "0")}:00`);
    timeOptions.push(`${i.toString().padStart(2, "0")}:30`);
  }

  // MenuProps used on all Selects to avoid focusing / jumping to top
  const selectMenuProps = {
    MenuListProps: { autoFocus: false },
    getContentAnchorEl: null,
    anchorOrigin: { vertical: "bottom", horizontal: "left" },
    transformOrigin: { vertical: "top", horizontal: "left" },
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (success) {
      alert.success("Product Created Successfully");
      history.push("/admin/dashboard");
      dispatch({ type: NEW_PRODUCT_RESET });
    }
    // eslint-disable-next-line
  }, [dispatch, alert, error, history, success]);

  const createProductSubmitHandler = (e) => {
    e.preventDefault();

    // Validate availability date and time
    if (
      !availability.availableFrom.date ||
      !availability.availableFrom.time ||
      !availability.availableTo.date ||
      !availability.availableTo.time
    ) {
      alert.error("Please provide both date and time for availability.");
      return;
    }

    const myForm = new FormData();

    // Basic Information
    myForm.set("name", name);
    myForm.set("description", description);
    myForm.set("sku", sku);
    myForm.set("Stock", Stock);
    myForm.set("info", info);
    myForm.set("location", location);
    myForm.set("keyFeatures", keyFeatures);

    // Sports Category
    myForm.set("sportsCategory", sportsCategory);

    // Rental Pricing
    myForm.set("firstHourPrice", firstHourPrice);
    myForm.set("subsequentHourPrice", subsequentHourPrice);

    // Clean tennisSpecs and padelSpecs before sending
    const cleanTennisSpecs = {};
    Object.entries(tennisSpecs).forEach(([key, value]) => {
      if (typeof value === "string") {
        if (value.trim() !== "") cleanTennisSpecs[key] = value.trim();
      } else if (value !== "" && value !== null && value !== undefined) {
        cleanTennisSpecs[key] = value;
      }
    });

    const cleanPadelSpecs = {};
    Object.entries(padelSpecs).forEach(([key, value]) => {
      if (typeof value === "string") {
        if (value.trim() !== "") cleanPadelSpecs[key] = value.trim();
      } else if (value !== "" && value !== null && value !== undefined) {
        cleanPadelSpecs[key] = value;
      }
    });

    // Category-specific specs
    if (
      sportsCategory === "Tennis" &&
      Object.keys(cleanTennisSpecs).length > 0
    ) {
      myForm.set("tennisSpecs", JSON.stringify(cleanTennisSpecs));
    } else if (
      sportsCategory === "Padel" &&
      Object.keys(cleanPadelSpecs).length > 0
    ) {
      myForm.set("padelSpecs", JSON.stringify(cleanPadelSpecs));
    }

    // Free Items
    myForm.set("freeItems", JSON.stringify(freeItems));

    // Availability - This is the key addition
    myForm.set("availability", JSON.stringify(availability));

    // Legacy fields for compatibility
    myForm.set("category", category);
    myForm.set("price", firstHourPrice); // Use firstHourPrice for legacy price

    images.forEach((currImg) => {
      myForm.append("images", currImg);
    });

    dispatch(createProduct(myForm));
  };

  const createProductImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <MetaData title={"Add New Equipment"} />
          <div className={classes.updateProduct}>
            <div
              className={
                !toggle ? `${classes.firstBox1}` : `${classes.toggleBox1}`
              }
            >
              <Sidebar />
            </div>

            <div className={classes.secondBox1}>
              <div className={classes.navBar1}>
                <Navbar toggleHandler={toggleHandler} />
              </div>

              <div className={`${classes.formContainer} ${classes.formContainer2}`}>
                <form
                  className={`${classes.form} ${classes.form2}`}
                  encType="multipart/form-data"
                  onSubmit={createProductSubmitHandler}
                  style={{ maxWidth: "1400px", margin: "0 auto" }}
                >
                  <Avatar className={classes.avatar}>
                    <AddCircleOutlineIcon />
                  </Avatar>
                  <Typography
                    variant="h4"
                    component="h1"
                    className={classes.heading}
                  >
                    Add New Equipment
                  </Typography>

                  {/* Basic Information */}
                  <Card style={{ margin: "20px 0", padding: "20px" }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Basic Information
                      </Typography>

                      <TextField
                        variant="outlined"
                        fullWidth
                        className={classes.textField}
                        label="Equipment Name *"
                        placeholder="e.g., Wilson Clash 100 V3 Tennis Racket"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <ShoppingCartOutlinedIcon />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <Grid container spacing={2} style={{ marginTop: "10px" }}>
                        <Grid item xs={12} md={6}>
                          <FormControl fullWidth className={classes.textField}>
                            <Typography
                              variant="body2"
                              style={{ marginBottom: "8px" }}
                            >
                              Sports Category *
                            </Typography>
                            <Select
                              variant="outlined"
                              value={sportsCategory}
                              onChange={handleSportsCategoryChange}
                              displayEmpty
                              MenuProps={selectMenuProps}
                            >
                              <MenuItem value="">Select Sport</MenuItem>
                              {sportsCategories.map((sport) => (
                                <MenuItem key={sport} value={sport}>
                                  {sport === "Tennis" && "🎾"}
                                  {sport === "Padel" && "🏓"}
                                  {sport === "Golf" && "⛳"}
                                  {sport === "Beach Tennis" && "🏖️"}
                                  {sport}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6}>
                          <TextField
                            variant="outlined"
                            fullWidth
                            className={classes.textField}
                            label="SKU"
                            placeholder="e.g., WIL-CLA-100-V3"
                            value={sku}
                            onChange={(e) => setSku(e.target.value)}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <StorageIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>

                      <TextField
                        variant="outlined"
                        fullWidth
                        className={classes.textField}
                        label="Description *"
                        multiline
                        rows={4}
                        required
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detailed description of the equipment..."
                      />

                      <TextField
                        variant="outlined"
                        fullWidth
                        className={classes.textField}
                        label="Key Features (comma-separated)"
                        placeholder="Lightweight, Durable, Professional Grade, etc."
                        value={keyFeatures}
                        onChange={(e) => setKeyFeatures(e.target.value)}
                      />

                      <TextField
                        variant="outlined"
                        fullWidth
                        className={classes.textField}
                        label="Additional Info"
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <InfoIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Rental Pricing */}
                  <Card style={{ margin: "20px 0", padding: "20px" }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Pricing (AED)
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                          <TextField
                            variant="outlined"
                            fullWidth
                            label="First Hour Price *"
                            type="number"
                            required
                            value={firstHourPrice}
                            onChange={(e) =>
                              setFirstHourPrice(Number(e.target.value))
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <TextField
                            variant="outlined"
                            fullWidth
                            label="Subsequent Hour Price *"
                            type="number"
                            required
                            value={subsequentHourPrice}
                            onChange={(e) =>
                              setSubsequentHourPrice(Number(e.target.value))
                            }
                          />
                        </Grid>
                      </Grid>
                      <Typography variant="body2" style={{ marginTop: "10px" }}>
                        The price for any rental will be: first hour price + (
                        subsequent hour price × number of additional hours)
                      </Typography>
                    </CardContent>
                  </Card>

                  {/* Sports-Specific Specifications */}
                  {sportsCategory === "Tennis" && (
                    <Card style={{ margin: "20px 0", padding: "20px" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          🎾 Tennis Racket Specifications
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={classes.textField}>
                              <Typography
                                variant="body2"
                                style={{ marginBottom: "8px" }}
                              >
                                Brand *
                              </Typography>
                              <Select
                                variant="outlined"
                                value={tennisSpecs.brand}
                                onChange={(e) =>
                                  setTennisSpecs({
                                    ...tennisSpecs,
                                    brand: e.target.value,
                                  })
                                }
                                displayEmpty
                                MenuProps={selectMenuProps}
                              >
                                <MenuItem value="">Select tennis brand</MenuItem>
                                {tennisbrands.map((brand) => (
                                  <MenuItem key={brand} value={brand}>
                                    {brand}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={classes.textField}>
                              <Typography
                                variant="body2"
                                style={{ marginBottom: "8px" }}
                              >
                                Head Size *
                              </Typography>
                              <Select
                                variant="outlined"
                                value={tennisSpecs.headSize}
                                onChange={(e) =>
                                  setTennisSpecs({
                                    ...tennisSpecs,
                                    headSize: e.target.value,
                                  })
                                }
                                displayEmpty
                                MenuProps={selectMenuProps}
                              >
                                <MenuItem value="">Select head size</MenuItem>
                                <MenuItem value="95-98">95-98 sq in</MenuItem>
                                <MenuItem value="98-100">98-100 sq in</MenuItem>
                                <MenuItem value="100-105">100-105 sq in</MenuItem>
                                <MenuItem value="105+">105+ sq in</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={classes.textField}>
                              <Typography
                                variant="body2"
                                style={{ marginBottom: "8px" }}
                              >
                                Grip Size *
                              </Typography>
                              <Select
                                variant="outlined"
                                value={tennisSpecs.gripSize}
                                onChange={(e) =>
                                  setTennisSpecs({
                                    ...tennisSpecs,
                                    gripSize: e.target.value,
                                  })
                                }
                                displayEmpty
                                MenuProps={selectMenuProps}
                              >
                                <MenuItem value="">Select grip size</MenuItem>
                                <MenuItem value="1">1 (4 1/8")</MenuItem>
                                <MenuItem value="2">2 (4 1/4")</MenuItem>
                                <MenuItem value="3">3 (4 3/8")</MenuItem>
                                <MenuItem value="4">4 (4 1/2")</MenuItem>
                                <MenuItem value="5">5 (4 5/8")</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              className={classes.textField}
                              label="String Pattern"
                              placeholder="e.g., 16x19"
                              value={tennisSpecs.stringPattern}
                              onChange={(e) =>
                                setTennisSpecs({
                                  ...tennisSpecs,
                                  stringPattern: e.target.value,
                                })
                              }
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              className={classes.textField}
                              label="Unstrung Weight (grams) *"
                              type="number"
                              placeholder="e.g., 295"
                              value={tennisSpecs.unstrungWeight}
                              onChange={(e) =>
                                setTennisSpecs({
                                  ...tennisSpecs,
                                  unstrungWeight: Number(e.target.value),
                                })
                              }
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              className={classes.textField}
                              label="Length (inches) *"
                              type="number"
                              placeholder="e.g., 27"
                              value={tennisSpecs.length}
                              onChange={(e) =>
                                setTennisSpecs({
                                  ...tennisSpecs,
                                  length: Number(e.target.value),
                                })
                              }
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  )}

                  {sportsCategory === "Padel" && (
                    <Card style={{ margin: "20px 0", padding: "20px" }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          🏓 Padel Racket Specifications
                        </Typography>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={classes.textField}>
                              <Typography
                                variant="body2"
                                style={{ marginBottom: "8px" }}
                              >
                                Brand *
                              </Typography>
                              <Select
                                variant="outlined"
                                value={padelSpecs.brand}
                                onChange={(e) =>
                                  setPadelSpecs({
                                    ...padelSpecs,
                                    brand: e.target.value,
                                  })
                                }
                                displayEmpty
                                MenuProps={selectMenuProps}
                              >
                                <MenuItem value="">Select padel brand</MenuItem>
                                {padelBrands.map((brand) => (
                                  <MenuItem key={brand} value={brand}>
                                    {brand}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              className={classes.textField}
                              label="Weight (grams) *"
                              type="number"
                              placeholder="e.g., 360"
                              value={padelSpecs.weight}
                              onChange={(e) =>
                                setPadelSpecs({
                                  ...padelSpecs,
                                  weight: Number(e.target.value),
                                })
                              }
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={classes.textField}>
                              <Typography
                                variant="body2"
                                style={{ marginBottom: "8px" }}
                              >
                                Shape *
                              </Typography>
                              <Select
                                variant="outlined"
                                value={padelSpecs.shape}
                                onChange={(e) =>
                                  setPadelSpecs({
                                    ...padelSpecs,
                                    shape: e.target.value,
                                  })
                                }
                                displayEmpty
                                MenuProps={selectMenuProps}
                              >
                                <MenuItem value="">Select racket shape</MenuItem>
                                <MenuItem value="Round">Round</MenuItem>
                                <MenuItem value="Teardrop">Teardrop</MenuItem>
                                <MenuItem value="Diamond">Diamond</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={classes.textField}>
                              <Typography
                                variant="body2"
                                style={{ marginBottom: "8px" }}
                              >
                                Balance
                              </Typography>
                              <Select
                                variant="outlined"
                                value={padelSpecs.balance}
                                onChange={(e) =>
                                  setPadelSpecs({
                                    ...padelSpecs,
                                    balance: e.target.value,
                                  })
                                }
                                displayEmpty
                                MenuProps={selectMenuProps}
                              >
                                <MenuItem value="">Select balance</MenuItem>
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              className={classes.textField}
                              label="Core Material"
                              placeholder="e.g., EVA Soft"
                              value={padelSpecs.coreMaterial}
                              onChange={(e) =>
                                setPadelSpecs({
                                  ...padelSpecs,
                                  coreMaterial: e.target.value,
                                })
                              }
                            />
                          </Grid>

                          <Grid item xs={12} md={6}>
                            <FormControl fullWidth className={classes.textField}>
                              <Typography
                                variant="body2"
                                style={{ marginBottom: "8px" }}
                              >
                                Surface
                              </Typography>
                              <Select
                                variant="outlined"
                                value={padelSpecs.surface}
                                onChange={(e) =>
                                  setPadelSpecs({
                                    ...padelSpecs,
                                    surface: e.target.value,
                                  })
                                }
                                displayEmpty
                                MenuProps={selectMenuProps}
                              >
                                <MenuItem value="">Select surface type</MenuItem>
                                <MenuItem value="Smooth">Smooth</MenuItem>
                                <MenuItem value="Rough">Rough</MenuItem>
                                <MenuItem value="Mixed">Mixed</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  )}

                  {/* Free Items Included */}
                  <Card style={{ margin: "20px 0", padding: "20px" }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Free Items Included
                      </Typography>

                      {freeItems.map((item, index) => (
                        <Grid
                          container
                          spacing={2}
                          key={index}
                          alignItems="center"
                          style={{ marginBottom: "10px" }}
                        >
                          <Grid item xs={12} md={4}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              label="Free Item Name"
                              placeholder={
                                index === 0 && sportsCategory === "Padel"
                                  ? "Padel Balls"
                                  : "Item name"
                              }
                              value={item.name}
                              onChange={(e) =>
                                handleFreeItemChange(index, "name", e.target.value)
                              }
                            />
                          </Grid>
                          <Grid item xs={6} md={2}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              label="Quantity"
                              type="number"
                              value={item.quantity}
                              onChange={(e) =>
                                handleFreeItemChange(
                                  index,
                                  "quantity",
                                  Number(e.target.value)
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={12} md={5}>
                            <TextField
                              variant="outlined"
                              fullWidth
                              label="Description"
                              placeholder={
                                index === 0 && sportsCategory === "Padel"
                                  ? "Professional tournament balls"
                                  : "Item description"
                              }
                              value={item.description}
                              onChange={(e) =>
                                handleFreeItemChange(
                                  index,
                                  "description",
                                  e.target.value
                                )
                              }
                            />
                          </Grid>
                          <Grid item xs={6} md={1}>
                            {freeItems.length > 1 && (
                              <IconButton
                                onClick={() => handleRemoveFreeItem(index)}
                                color="secondary"
                              >
                                <DeleteIcon />
                              </IconButton>
                            )}
                          </Grid>
                        </Grid>
                      ))}

                      <Button
                        startIcon={<AddIcon />}
                        onClick={handleAddFreeItem}
                        style={{ marginTop: "10px" }}
                      >
                        Add Free Item
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Availability - Simplified without DatePicker */}
                  <Card style={{ margin: "20px 0", padding: "20px" }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Availability
                      </Typography>

                      <Grid container spacing={2}>
                        {/* Available From */}
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body2"
                            style={{ marginBottom: "8px" }}
                          >
                            Available From{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Typography>
                          <Grid container spacing={1}>
                            <Grid item xs={8}>
                              <TextField
                                variant="outlined"
                                type="date"
                                fullWidth
                                required
                                value={availability.availableFrom.date}
                                onChange={(e) =>
                                  setAvailability((prev) => ({
                                    ...prev,
                                    availableFrom: {
                                      ...prev.availableFrom,
                                      date: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <FormControl fullWidth>
                                <Select
                                  variant="outlined"
                                  required
                                  value={availability.availableFrom.time}
                                  onChange={(e) =>
                                    setAvailability((prev) => ({
                                      ...prev,
                                      availableFrom: {
                                        ...prev.availableFrom,
                                        time: e.target.value, // ✅ fixed mapping
                                      },
                                    }))
                                  }
                                  MenuProps={selectMenuProps}
                                >
                                  {timeOptions.map((time) => (
                                    <MenuItem key={time} value={time}>
                                      {time}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>

                        {/* Available To */}
                        <Grid item xs={12} md={6}>
                          <Typography
                            variant="body2"
                            style={{ marginBottom: "8px" }}
                          >
                            Available To{" "}
                            <span style={{ color: "red" }}>*</span>
                          </Typography>
                          <Grid container spacing={1}>
                            <Grid item xs={8}>
                              <TextField
                                variant="outlined"
                                type="date"
                                fullWidth
                                required
                                value={availability.availableTo.date}
                                onChange={(e) =>
                                  setAvailability((prev) => ({
                                    ...prev,
                                    availableTo: {
                                      ...prev.availableTo,
                                      date: e.target.value,
                                    },
                                  }))
                                }
                              />
                            </Grid>
                            <Grid item xs={4}>
                              <FormControl fullWidth>
                                <Select
                                  variant="outlined"
                                  required
                                  value={availability.availableTo.time}
                                  onChange={(e) =>
                                    setAvailability((prev) => ({
                                      ...prev,
                                      availableTo: {
                                        ...prev.availableTo,
                                        time: e.target.value,
                                      },
                                    }))
                                  }
                                  MenuProps={selectMenuProps}
                                >
                                  {timeOptions.map((time) => (
                                    <MenuItem key={time} value={time}>
                                      {time}
                                    </MenuItem>
                                  ))}
                                </Select>
                              </FormControl>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>

                      <TextField
                        variant="outlined"
                        fullWidth
                        className={classes.textField}
                        label="Location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <LocationOnIcon />
                            </InputAdornment>
                          ),
                        }}
                      />

                      <TextField
                        variant="outlined"
                        fullWidth
                        className={classes.textField}
                        label="Stock Quantity *"
                        type="number"
                        required
                        value={Stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <StorageIcon />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </CardContent>
                  </Card>

                  {/* Legacy Category for backward compatibility */}
                  <div className={classes.selectOption}>
                    {!isCategory && (
                      <Typography variant="body2" className={classes.labelText}>
                        Legacy Category (for compatibility)
                      </Typography>
                    )}
                    <FormControl className={classes.formControl}>
                      <Select
                        variant="outlined"
                        fullWidth
                        value={category}
                        onChange={handleCategoryChange}
                        className={classes.select}
                        MenuProps={selectMenuProps}
                      >
                        {!category && (
                          <MenuItem value="">
                            <em>Choose Category</em>
                          </MenuItem>
                        )}
                        {categories.map((cate) => (
                          <MenuItem key={cate} value={cate}>
                            {cate}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>

                  {/* Product Images */}
                  <Card style={{ margin: "20px 0", padding: "20px" }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Product Images
                      </Typography>

                      <div className={classes.root}>
                        <div className={classes.imgIcon}>
                          <CollectionsIcon fontSize="large" style={{ fontSize: 40 }} />
                        </div>

                        <input
                          type="file"
                          name="avatar"
                          className={classes.input}
                          accept="image/*"
                          onChange={createProductImagesChange}
                          multiple
                          style={{ display: "none" }}
                          ref={fileInputRef}
                        />
                        <label htmlFor="avatar-input">
                          <Button
                            variant="contained"
                            color="default"
                            className={classes.uploadAvatarButton}
                            startIcon={<CloudUploadIcon style={{ color: "#FFFFFF" }} />}
                            onClick={handleImageUpload}
                          >
                            <p className={classes.uploadAvatarText}>
                              Click to upload or drag and drop
                            </p>
                          </Button>
                        </label>
                      </div>

                      <Typography
                        variant="body2"
                        style={{ color: "#666", marginTop: "10px" }}
                      >
                        PNG, JPG or JPEG (MAX. 5MB each)
                      </Typography>

                      <Box className={classes.imageArea}>
                        {imagesPreview &&
                          imagesPreview.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt="Product Preview"
                              className={classes.image}
                            />
                          ))}
                      </Box>
                    </CardContent>
                  </Card>

                  <Button
                    variant="contained"
                    className={classes.loginButton}
                    fullWidth
                    type="submit"
                    disabled={loading}
                    style={{ marginTop: "30px", padding: "15px" }}
                  >
                    Create Equipment
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default NewProduct;
