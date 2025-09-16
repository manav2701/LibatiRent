import React from "react";
import "./Shipping.css";
import { useSelector, useDispatch } from "react-redux";
import { saveShippingInfo } from "../../actions/cartAction";
import MetaData from "../layouts/MataData/MataData";
import CheckoutSteps from "./CheckoutSteps ";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Card,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import axios from "axios";
import AddressPicker from "./AddressPicker";

const useStyles = makeStyles((theme) => ({
  shippingRoot: {
    width: "60%",
    margin: "auto",
    background: "#181A20",
    borderRadius: "18px",
    boxShadow: "0 4px 32px 0 rgba(0,0,0,0.25)",
    padding: "2rem 2rem 2.5rem 2rem",
    [theme.breakpoints.down("sm")]: {
      width: "98%",
      padding: "1rem",
    },
  },
  heading: {
    marginBottom: theme.spacing(2),
    alignSelf: "flex-start",
    color: "#fff",
    fontWeight: 700,
    letterSpacing: "1px",
  },
  submitButton: {
    marginTop: theme.spacing(2),
    width: "50%",
    background: "linear-gradient(135deg, #4F8CFF 0%, #1E2746 100%)",
    color: "#fff",
    height: "3rem",
    fontWeight: 700,
    borderRadius: "12px",
    fontSize: "1.1rem",
    boxShadow: "0 8px 25px rgba(79,140,255,0.15)",
    "&:hover": {
      background: "linear-gradient(135deg, #1E2746 0%, #4F8CFF 100%)",
      color: "#fff",
    },
  },
  outlinedInput: {
    "& .MuiOutlinedInput-root": {
      background: "#23262F",
      borderRadius: "10px",
      color: "#fff",
      "& fieldset": {
        borderColor: "#4F8CFF",
      },
      "&:hover fieldset": {
        borderColor: "#4F8CFF",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#4F8CFF",
      },
    },
    "& .MuiInputBase-input": {
      color: "#fff",
    },
    "& .MuiInputLabel-root": {
      color: "#B0B3B8",
    },
  },
  subtitle: {
    color: "#4F8CFF",
    fontWeight: 600,
    marginTop: "2rem",
    marginBottom: "0.5rem",
    letterSpacing: "0.5px",
  },
  card: {
    background: "#23262F",
    color: "#fff",
    borderRadius: "12px",
    boxShadow: "0 2px 12px 0 rgba(79,140,255,0.08)",
    marginBottom: "1.5rem",
    padding: "1.2rem",
  },
  checkboxLabel: {
    color: "#B0B3B8",
    fontWeight: 500,
  },
}));

const EMIRATES = [
  "Abu Dhabi",
  "Dubai",
  "Sharjah",
  "Ajman",
  "Umm Al Quwain",
  "Ras Al Khaimah",
  "Fujairah",
];

// Add country code list (ISO 3166-1 alpha-2 with dial codes)
const COUNTRY_CODES = [
  { code: "+971", name: "United Arab Emirates" },
  { code: "+91", name: "India" },
  { code: "+1", name: "United States" },
  { code: "+44", name: "United Kingdom" },
  { code: "+61", name: "Australia" },
  { code: "+974", name: "Qatar" },
  { code: "+966", name: "Saudi Arabia" },
  { code: "+973", name: "Bahrain" },
  { code: "+965", name: "Kuwait" },
  { code: "+968", name: "Oman" },
  // ...add more as needed
];

const Shipping = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { cartItems } = useSelector((state) => state.cart);

  const classes = useStyles();

  // Delivery Address
  const [deliveryAddress, setDeliveryAddress] = React.useState({
    address: "",
    city: "",
    emirate: "",
    countryCode: "+971",
    phoneNo: "",
    email: "",
  });

  // Pickup Address
  const [pickupAddress, setPickupAddress] = React.useState({
    address: "",
    city: "",
    emirate: "",
    countryCode: "+971",
    phoneNo: "",
  });

  // Rental Info (date/time)
  const [rentalInfo, setRentalInfo] = React.useState({
    deliveryDate: "",
    deliveryTime: "",
    pickupDate: "",
    pickupTime: "",
  });

  // Same as delivery checkbox
  const [sameAsDelivery, setSameAsDelivery] = React.useState(false);

  // OTP state
  const [otp, setOtp] = React.useState("");
  const [otpSent, setOtpSent] = React.useState(false);
  const [otpVerified, setOtpVerified] = React.useState(false);
  const [otpLoading, setOtpLoading] = React.useState(false);

  // Add new state for map-selected addresses
  const [deliveryMapAddress, setDeliveryMapAddress] = React.useState(null);
  const [pickupMapAddress, setPickupMapAddress] = React.useState(null);

  // If "Same as Delivery" is checked, copy delivery address to pickup address (except email)
  React.useEffect(() => {
    if (sameAsDelivery) {
      const { email, ...rest } = deliveryAddress;
      setPickupAddress({ ...rest });
    }
  }, [sameAsDelivery, deliveryAddress]);

  // If cart has rentalConfig, prefill rentalInfo
  React.useEffect(() => {
    if (cartItems && cartItems.length > 0 && cartItems[0].rentalConfig) {
      const rc = cartItems[0].rentalConfig;
      setRentalInfo({
        deliveryDate: rc.pickupDate || "",
        deliveryTime: rc.pickupTime || "",
        pickupDate: rc.returnDate || "",
        pickupTime: rc.returnTime || "",
      });
    }
  }, [cartItems]);

  const handleDeliveryChange = (field, value) => {
    setDeliveryAddress((prev) => ({ ...prev, [field]: value }));
    if (field === "email") {
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
    }
  };
  const handlePickupChange = (field, value) => {
    setPickupAddress((prev) => ({ ...prev, [field]: value }));
  };
  const handleRentalChange = (field, value) => {
    setRentalInfo((prev) => ({ ...prev, [field]: value }));
  };

  // OTP handlers
  const handleSendOtp = async () => {
    setOtpLoading(true);
    try {
      await axios.post("/api/otp/send", { email: deliveryAddress.email });
      setOtpSent(true);
      alert.success("OTP sent to email");
    } catch (err) {
      alert.error("Failed to send OTP");
    }
    setOtpLoading(false);
  };

  const handleVerifyOtp = async () => {
    setOtpLoading(true);
    try {
      await axios.post("/api/otp/verify", { email: deliveryAddress.email, otp });
      setOtpVerified(true);
      alert.success("Email verified!");
    } catch (err) {
      alert.error("Invalid OTP");
    }
    setOtpLoading(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Validate all fields
    const requiredFields = [
      "address",
      "city",
      "emirate",
      "countryCode",
      "phoneNo",
      "email",
    ];
    for (const field of requiredFields) {
      if (!deliveryAddress[field]) {
        alert.error("Please fill all delivery address fields");
        return;
      }
    }
    const pickupFields = [
      "address",
      "city",
      "emirate",
      "countryCode",
      "phoneNo",
    ];
    for (const field of pickupFields) {
      if (!pickupAddress[field]) {
        alert.error("Please fill all pickup address fields");
        return;
      }
    }
    if (
      !rentalInfo.deliveryDate ||
      !rentalInfo.deliveryTime ||
      !rentalInfo.pickupDate ||
      !rentalInfo.pickupTime
    ) {
      alert.error("Please select delivery and pickup date/time");
      return;
    }
    if (!otpVerified) {
      alert.error("Please verify your email with OTP");
      return;
    }
    dispatch(
      saveShippingInfo({
        deliveryAddress,
        pickupAddress,
        rentalInfo,
      })
    );
    history.push("/process/payment");
  };

  // Helper for displaying date/time in readable format
  const formatDateTime = (date, time) => {
    if (!date || !time) return "";
    const dt = new Date(`${date}T${time}:00+04:00`);
    return dt.toLocaleString("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Dubai",
    });
  };

  return (
    <>
      <div className="shippingPage" style={{ background: "#181A20", minHeight: "100vh" }}>
        <MetaData title={"Shipping Info"} />
        <CheckoutSteps activeStep={1} />

        <div className="shippingPage__container">
          <div className="shippingPage__container__left">
            <div className={classes.shippingRoot}>
              <form onSubmit={handleSubmit}>
                <Typography variant="h6" className={classes.heading}>
                  Delivery Address
                </Typography>
                {/* Google Maps Address Picker for Delivery */}
                <AddressPicker
                  label="Select Delivery Address on Map"
                  onAddressSelect={(addr) => {
                    setDeliveryMapAddress(addr);
                    setDeliveryAddress((prev) => ({
                      ...prev,
                      address: addr.formatted_address,
                    }));
                  }}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Address"
                      variant="outlined"
                      fullWidth
                      value={deliveryAddress.address}
                      onChange={(e) =>
                        handleDeliveryChange("address", e.target.value)
                      }
                      className={classes.outlinedInput}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="City"
                      variant="outlined"
                      fullWidth
                      value={deliveryAddress.city}
                      onChange={(e) =>
                        handleDeliveryChange("city", e.target.value)
                      }
                      className={classes.outlinedInput}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      select
                      label="Emirate"
                      variant="outlined"
                      fullWidth
                      SelectProps={{ native: true }}
                      value={deliveryAddress.emirate}
                      onChange={(e) =>
                        handleDeliveryChange("emirate", e.target.value)
                      }
                      className={classes.outlinedInput}
                    >
                      <option value="">Select Emirate</option>
                      {EMIRATES.map((em) => (
                        <option key={em} value={em}>
                          {em}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      select
                      label="Country Code"
                      variant="outlined"
                      fullWidth
                      value={deliveryAddress.countryCode}
                      onChange={(e) =>
                        handleDeliveryChange("countryCode", e.target.value)
                      }
                      className={classes.outlinedInput}
                      SelectProps={{
                        native: true,
                        MenuProps: {
                          PaperProps: {
                            style: {
                              background: "#23262F",
                              color: "#bae6fd",
                            },
                          },
                        },
                        style: {
                          background: "#23262F",
                          color: "#bae6fd",
                        },
                      }}
                      InputLabelProps={{
                        style: { color: "#bae6fd" }
                      }}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option
                          key={c.code}
                          value={c.code}
                          style={{
                            background: "#23262F",
                            color: "#bae6fd"
                          }}
                        >
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Phone"
                      variant="outlined"
                      fullWidth
                      value={deliveryAddress.phoneNo}
                      onChange={(e) =>
                        handleDeliveryChange("phoneNo", e.target.value)
                      }
                      className={classes.outlinedInput}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      label="Email"
                      variant="outlined"
                      fullWidth
                      value={deliveryAddress.email}
                      onChange={(e) =>
                        handleDeliveryChange("email", e.target.value)
                      }
                      className={classes.outlinedInput}
                      type="email"
                      required
                    />
                  </Grid>
                  <Grid item xs={8}>
                    <TextField
                      label="OTP"
                      variant="outlined"
                      fullWidth
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className={classes.outlinedInput}
                      disabled={!otpSent || otpVerified}
                    />
                  </Grid>
                  <Grid item xs={4} style={{ display: "flex", alignItems: "center" }}>
                    {!otpSent ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleSendOtp}
                        disabled={!deliveryAddress.email || otpLoading}
                      >
                        {otpLoading ? "Sending..." : "Send OTP"}
                      </Button>
                    ) : !otpVerified ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleVerifyOtp}
                        disabled={!otp || otpLoading}
                      >
                        {otpLoading ? "Verifying..." : "Verify OTP"}
                      </Button>
                    ) : (
                      <span style={{ color: "#4F8CFF", fontWeight: 600 }}>Verified</span>
                    )}
                  </Grid>
                </Grid>

                <Typography
                  variant="subtitle1"
                  className={classes.subtitle}
                >
                  Pickup Address
                </Typography>
                {/* Google Maps Address Picker for Pickup */}
                <AddressPicker
                  label="Select Pickup Address on Map"
                  onAddressSelect={(addr) => {
                    setPickupMapAddress(addr);
                    setPickupAddress((prev) => ({
                      ...prev,
                      address: addr.formatted_address,
                    }));
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={sameAsDelivery}
                      style={{ color: "#4F8CFF" }}
                      onChange={(e) => setSameAsDelivery(e.target.checked)}
                    />
                  }
                  label={<span className={classes.checkboxLabel}>Same as Delivery Address</span>}
                />
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Pickup Address"
                      variant="outlined"
                      fullWidth
                      value={pickupAddress.address}
                      onChange={(e) =>
                        handlePickupChange("address", e.target.value)
                      }
                      className={classes.outlinedInput}
                      disabled={sameAsDelivery}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Pickup City"
                      variant="outlined"
                      fullWidth
                      value={pickupAddress.city}
                      onChange={(e) =>
                        handlePickupChange("city", e.target.value)
                      }
                      className={classes.outlinedInput}
                      disabled={sameAsDelivery}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      select
                      label="Pickup Emirate"
                      variant="outlined"
                      fullWidth
                      SelectProps={{ native: true }}
                      value={pickupAddress.emirate}
                      onChange={(e) =>
                        handlePickupChange("emirate", e.target.value)
                      }
                      className={classes.outlinedInput}
                      disabled={sameAsDelivery}
                    >
                      <option value="">Select Emirate</option>
                      {EMIRATES.map((em) => (
                        <option key={em} value={em}>
                          {em}
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      select
                      label="Country Code"
                      variant="outlined"
                      fullWidth
                      value={pickupAddress.countryCode}
                      onChange={(e) =>
                        handlePickupChange("countryCode", e.target.value)
                      }
                      className={classes.outlinedInput}
                      SelectProps={{
                        native: true,
                        MenuProps: {
                          PaperProps: {
                            style: {
                              background: "#23262F",
                              color: "#bae6fd",
                            },
                          },
                        },
                        style: {
                          background: "#23262F",
                          color: "#bae6fd",
                        },
                      }}
                      InputLabelProps={{
                        style: { color: "#bae6fd" }
                      }}
                      disabled={sameAsDelivery}
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option
                          key={c.code}
                          value={c.code}
                          style={{
                            background: "#23262F",
                            color: "#bae6fd"
                          }}
                        >
                          {c.name} ({c.code})
                        </option>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Pickup Phone"
                      variant="outlined"
                      fullWidth
                      value={pickupAddress.phoneNo}
                      onChange={(e) =>
                        handlePickupChange("phoneNo", e.target.value)
                      }
                      className={classes.outlinedInput}
                      disabled={sameAsDelivery}
                    />
                  </Grid>
                </Grid>

                <Typography
                  variant="subtitle1"
                  className={classes.subtitle}
                >
                  Rental Dates & Times
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      label="Delivery Date"
                      type="date"
                      variant="outlined"
                      fullWidth
                      value={rentalInfo.deliveryDate}
                      onChange={(e) =>
                        handleRentalChange("deliveryDate", e.target.value)
                      }
                      className={classes.outlinedInput}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Delivery Time"
                      type="time"
                      variant="outlined"
                      fullWidth
                      value={rentalInfo.deliveryTime}
                      onChange={(e) =>
                        handleRentalChange("deliveryTime", e.target.value)
                      }
                      className={classes.outlinedInput}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Pickup Date"
                      type="date"
                      variant="outlined"
                      fullWidth
                      value={rentalInfo.pickupDate}
                      onChange={(e) =>
                        handleRentalChange("pickupDate", e.target.value)
                      }
                      className={classes.outlinedInput}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      label="Pickup Time"
                      type="time"
                      variant="outlined"
                      fullWidth
                      value={rentalInfo.pickupTime}
                      onChange={(e) =>
                        handleRentalChange("pickupTime", e.target.value)
                      }
                      className={classes.outlinedInput}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submitButton}
                    disabled={!otpVerified}
                  >
                    Continue
                  </Button>
                </Grid>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shipping;