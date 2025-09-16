import React, { useState } from "react";
import {
  Divider,
  Typography,
  Box,
  Button,
  TextField,
  FormControl,
  Select,
  MenuItem,
  Paper,
} from "@mui/material";
import { useAlert } from "react-alert";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import MetaData from "../component/layouts/MataData/MataData";

const useStyles = makeStyles((theme) => ({
  root_contactus: {
    padding: "6rem 0",
    background: "linear-gradient(135deg, rgba(15,23,42,0.95) 0%, #181c24 100%)",
    width: "100%",
    minHeight: "100vh",
    overflow: "hidden",
    fontFamily: "'Poppins', sans-serif",
    backdropFilter: "blur(14px)",
    WebkitBackdropFilter: "blur(14px)",
  },
  contact_Container_contactus: {
    width: "90%",
    maxWidth: 700,
    margin: "0 auto",
    background: "rgba(30,41,59,0.85)",
    borderRadius: 18,
    boxShadow: "0 8px 32px 0 rgba(59,130,246,0.18)",
    padding: "2.5rem 2rem",
    border: "1.5px solid rgba(59,130,246,0.18)",
    color: "#e0e7ef",
  },
  title_contact_us: {
    color: "#38bdf8",
    fontSize: "2rem !important",
    padding: "1rem 0 0.5rem 0",
    fontFamily: "Poppins",
    fontWeight: 700,
    letterSpacing: "2px",
    textAlign: "center",
    textShadow: "0 2px 12px #0ea5e9a0",
  },
  divider_contact: {
    width: "100%",
    backgroundColor: "#334155",
    margin: "2rem 0 !important",
    opacity: 0.4,
  },
  helpTitle_contact_us: {
    fontSize: "1.2rem",
    color: "#bae6fd",
    padding: "1.5rem 0 0.5rem 0",
    fontWeight: 700,
    letterSpacing: "1px",
  },
  para_contact: {
    marginBottom: "1.5rem",
    color: "#e0e7ef",
    fontSize: "1rem !important",
    width: "100%",
    letterSpacing: "1px",
    lineHeight: 1.7,
  },
  address_contacts: {
    marginBottom: "2rem",
    color: "#bae6fd",
    fontSize: "1rem !important",
    width: "100%",
    letterSpacing: "1px",
    fontWeight: 500,
  },
  buttonGroup: {
    display: "flex",
    gap: "1.5rem",
    margin: "1.5rem 0",
    justifyContent: "center",
  },
  supportButton: {
    background: "linear-gradient(135deg, #3b82f6, #181c24) !important",
    color: "#fff !important",
    borderRadius: "50px !important",
    fontWeight: 600,
    fontSize: "1rem",
    padding: "12px 32px !important",
    boxShadow: "0 8px 25px rgba(59,130,246,0.18) !important",
    textTransform: "none",
    "&:hover": {
      background: "#2563eb !important",
      color: "#fff !important",
    },
  },
  callButton: {
    background: "transparent !important",
    border: "2px solid #38bdf8 !important",
    color: "#38bdf8 !important",
    borderRadius: "50px !important",
    fontWeight: 600,
    fontSize: "1rem",
    padding: "12px 32px !important",
    textTransform: "none",
    "&:hover": {
      background: "#38bdf8 !important",
      color: "#fff !important",
    },
  },
  formContainer_container: {
    marginTop: "1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.2rem",
  },
  formField_contact: {
    width: "100%",
    marginBottom: "0.5rem",
  },
  submitButtons: {
    alignSelf: "center",
    background: "linear-gradient(135deg, #3b82f6, #181c24) !important",
    color: "#fff !important",
    borderRadius: "50px !important",
    fontWeight: 700,
    fontSize: "1.1rem",
    padding: "12px 40px !important",
    marginTop: "1.5rem !important",
    boxShadow: "0 8px 25px rgba(59,130,246,0.18) !important",
    textTransform: "none",
    "&:hover": {
      background: "#2563eb !important",
      color: "#fff !important",
    },
  },
  SelectOption_contact: {
    width: "100%",
    marginBottom: "0.5rem",
    color: "#e0e7ef",
  },
  lableText_contact: {
    color: "#bae6fd",
    fontSize: "1rem",
    fontWeight: 600,
    marginBottom: "0.5rem",
    letterSpacing: "1px",
  },
  menu_contact: {
    background: "#181c24",
    color: "#bae6fd",
  },
}));

const DUBAI_MOBILE = "+971501234567"; // Example Dubai mobile number

const ContactForm = () => {
  const classes = useStyles();
  const alert = useAlert();
  const history = useHistory();

  // Form state
  const [form, setForm] = useState({
    issue: "e-commerce",
    detail: "others",
    language: "english",
    email: "",
    message: "",
  });

  // You can access the submitted data here in the handleSubmit function
  // For example, send it to your backend or log it
  const handleSubmit = (e) => {
    e.preventDefault();
    // Access form data here
    // Example: send to backend or log
    // fetch("/api/v1/contact", { method: "POST", body: JSON.stringify(form) })
    alert.success("Your message has been sent successfully");
    // console.log("Submitted contact form data:", form);
    history.push("/");
  };

  const handleCall = () => {
    window.location.href = `tel:${DUBAI_MOBILE}`;
  };

  return (
    <Box className={classes.root_contactus}>
      <MetaData title={"Contact Us"} />
      <Paper elevation={0} className={classes.contact_Container_contactus}>
        <Typography variant="h2" className={classes.title_contact_us}>
          Contact Us
        </Typography>
        <Divider className={classes.divider_contact} />
        <Typography variant="h4" className={classes.helpTitle_contact_us}>
          Need Help?
        </Typography>
        <Typography variant="body2" className={classes.para_contact}>
          We have live chat available, look for the chat icon in the lower right
          hand corner of this page. If it isn't there, then give us a call at{" "}
          <strong
            style={{
              textDecoration: "underline",
              cursor: "pointer",
              color: "#38bdf8",
            }}
            onClick={handleCall}
          >
            {DUBAI_MOBILE}
          </strong>
          .
        </Typography>
        <Typography variant="body2" className={classes.para_contact}>
          <span>7:00-6:00 GST Monday-Friday</span>
          <br />
          <span>9:00-4:00 GST Saturday</span>
          <br />
          <span>Closed Sunday</span>
        </Typography>
        <Typography variant="body2" className={classes.para_contact}>
          Catch us outside these hours? Fill out our support form below, and
          we'll be in touch shortly.
        </Typography>
        <Typography variant="body2" className={classes.address_contacts}>
          <span style={{ fontWeight: "600", color: "#38bdf8" }}>
            Libati Sports Rental, Pvt Ltd.
          </span>
          <br />
          Al Mamzar Beach
          <br />
          Sharjah
          <br />
          UAE
        </Typography>
        <div className={classes.buttonGroup}>
          <a href="#issue-select" style={{ textDecoration: "none" }}>
            <Button variant="contained" className={classes.supportButton}>
              Support Form
            </Button>
          </a>
          <Button
            variant="contained"
            className={classes.callButton}
            onClick={handleCall}
          >
            Call Us
          </Button>
        </div>
        <Divider className={classes.divider_contact} />
        <div className={classes.supportForm}>
          <Typography
            variant="h4"
            className={classes.title_contact_us}
            style={{ paddingBottom: "1rem" }}
          >
            Support Form
          </Typography>
          <Typography variant="body2" className={classes.para_contact}>
            Need a quicker answer? Look for our chat icon on the right hand side
            of this page.
          </Typography>
          <form
            className={classes.formContainer_container}
            onSubmit={handleSubmit}
          >
            <div className={classes.SelectOption_contact}>
              <Typography variant="body2" className={classes.lableText_contact}>
                ISSUE *
              </Typography>
              <FormControl className={classes.formField_contact}>
                <Select
                  labelId="issue-label"
                  id="issue-select"
                  value={form.issue}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, issue: e.target.value }))
                  }
                  MenuProps={{
                    classes: { paper: classes.menu_contact },
                  }}
                  sx={{
                    background: "#181c24",
                    color: "#bae6fd",
                  }}
                >
                  <MenuItem value="e-commerce">E-Commerce</MenuItem>
                  <MenuItem value="app">App</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className={classes.SelectOption_contact}>
              <Typography variant="body2" className={classes.lableText_contact}>
                DETAIL *
              </Typography>
              <FormControl className={classes.formField_contact}>
                <Select
                  labelId="detail-label"
                  id="detail-select"
                  value={form.detail}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, detail: e.target.value }))
                  }
                  MenuProps={{
                    classes: { paper: classes.menu_contact },
                  }}
                  sx={{
                    background: "#181c24",
                    color: "#bae6fd",
                  }}
                >
                  <MenuItem value="availability">Availability</MenuItem>
                  <MenuItem value="return/exchange">Return/Exchange</MenuItem>
                  <MenuItem value="technical-support">
                    Technical Support
                  </MenuItem>
                  <MenuItem value="invoicing">Invoicing</MenuItem>
                  <MenuItem value="tracking-info">Tracking Info</MenuItem>
                  <MenuItem value="others">Others</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className={classes.SelectOption_contact}>
              <Typography variant="body2" className={classes.lableText_contact}>
                Language *
              </Typography>
              <FormControl className={classes.formField_contact}>
                <Select
                  labelId="language-label"
                  id="language-select"
                  value={form.language}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, language: e.target.value }))
                  }
                  MenuProps={{
                    classes: { paper: classes.menu_contact },
                  }}
                  sx={{
                    background: "#181c24",
                    color: "#bae6fd",
                  }}
                >
                  <MenuItem value="english">English</MenuItem>
                  <MenuItem value="arabic">Arabic</MenuItem>
                  <MenuItem value="hindi">Hindi</MenuItem>
                  <MenuItem value="japanese">Japanese</MenuItem>
                  <MenuItem value="chinese">Chinese</MenuItem>
                  <MenuItem value="german">German</MenuItem>
                </Select>
              </FormControl>
            </div>

            <div className={classes.SelectOption_contact}>
              <Typography variant="body2" className={classes.lableText_contact}>
                EMAIL *
              </Typography>
              <FormControl className={classes.formField_contact}>
                <TextField
                  placeholder="Enter Your Email *"
                  id="email-input"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  sx={{
                    background: "#181c24",
                    borderRadius: "8px",
                    input: { color: "#bae6fd" },
                  }}
                />
              </FormControl>
            </div>

            <div className={classes.SelectOption_contact}>
              <Typography variant="body2" className={classes.lableText_contact}>
                MESSAGE *
              </Typography>
              <FormControl className={classes.formField_contact}>
                <TextField
                  id="message-textarea"
                  multiline
                  rows={6}
                  variant="outlined"
                  placeholder="Enter Your Message *"
                  value={form.message}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, message: e.target.value }))
                  }
                  required
                  sx={{
                    background: "#181c24",
                    borderRadius: "8px",
                    textarea: { color: "#bae6fd" },
                  }}
                />
              </FormControl>
            </div>
            <Button
              type="submit"
              variant="contained"
              className={classes.submitButtons}
            >
              Submit
            </Button>
          </form>
        </div>
      </Paper>
    </Box>
  );
};

export default ContactForm;
