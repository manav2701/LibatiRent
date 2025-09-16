import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Stepper, Step, StepLabel, StepConnector } from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    marginBottom: theme.spacing(2),
    background: "transparent", // Remove background fill
    borderRadius: 18,
    boxShadow: "none", // Remove box shadow
    border: "none",    // Remove border
    padding: "2rem 1.5rem",
    fontFamily: "'Inter','Poppins',sans-serif",
    position: "relative",
    zIndex: 2,
    [theme.breakpoints.down("sm")]: {
      marginBottom: theme.spacing(1),
      padding: "1rem 0.5rem",
    },
  },
  stepReader: {
    marginTop: "7rem",
    background: "transparent", // Remove background fill
    borderRadius: 18,
    boxShadow: "none", // Remove box shadow
    border: "none",    // Remove border
    padding: "0.5rem 0",
    fontFamily: "'Inter','Poppins',sans-serif",
    position: "relative",
    zIndex: 2,
  },
  stepLabel: {
    color: "#dfe8edff !important",
    fontWeight: 700,
    fontFamily: "'Inter','Poppins',sans-serif",
    "& .MuiStepLabel-label": {
      color: "#e0e7ebff !important",
      fontWeight: 700,
      fontFamily: "'Inter','Poppins',sans-serif",
      fontSize: "1.1rem",
      letterSpacing: "0.5px",
      textShadow: "0 2px 12px #88c9e86e",
    },
    "&.MuiStepLabel-active .MuiStepLabel-label": {
      color: "#38bdf8 !important",
      fontWeight: 800,
      textShadow: "0 2px 12px #0ea5e9a0",
    },
    "&.MuiStepLabel-completed .MuiStepLabel-label": {
      color: "#4CAF50 !important",
    },
    [theme.breakpoints.down("xs")]: {
      "& .MuiStepLabel-label": {
        fontSize: 12,
      },
    },
  },
  stepperOverride: {
    background: "rgba(15,23,42,0.85) !important", // fixes the white background
    boxShadow: "0 8px 32px 0 rgba(59,130,246,0.18)",
    borderRadius: 18,
    border: "1.5px solid rgba(59,130,246,0.18)",
    padding: "1rem",
  },
}));

const ColorlibConnector = withStyles((theme) => ({
  alternativeLabel: {
    top: 10,
  },
  active: {
    "& $line": {
      background: "linear-gradient(90deg, #3b82f6, #ef4444)",
    },
  },
  completed: {
    "& $line": {
      background: "linear-gradient(90deg, #4CAF50, #3b82f6)",
    },
  },
  line: {
    height: 3,
    border: 0,
    background: "rgba(59,130,246,0.18)",
    borderRadius: 1,
  },
}))(StepConnector);

const useColorlibStepIconStyles = makeStyles((theme) => ({
  root: {
    background: "rgba(30,41,59,0.95)",
    zIndex: 1,
    color: "#bae6fd",
    width: 44,
    height: 44,
    display: "flex",
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    border: `2px solid #334155`,
    fontSize: 18,
    fontWeight: 700,
    boxShadow: "0 2px 12px #33415544",
    transition: "all 0.3s",
    [theme.breakpoints.down("sm")]: {
      width: 28,
      height: 28,
      fontSize: 14,
    },
    [theme.breakpoints.down("xs")]: {
      width: 20,
      height: 20,
      fontSize: 12,
    },
  },
  active: {
    background: "linear-gradient(135deg, #3b82f6 0%, #ef4444 100%)",
    color: "#fff",
    border: "2px solid #38bdf8",
    boxShadow: "0 4px 18px #38bdf8a0",
  },
  completed: {
    background: "linear-gradient(135deg, #4CAF50 0%, #3b82f6 100%)",
    color: "#fff",
    border: "2px solid #4CAF50",
    boxShadow: "0 2px 12px #4CAF5080",
  },
}));

const ColorlibStepIcon = ({ active, completed, icon, onClick }) => {
  const classes = useColorlibStepIconStyles();

  return (
    <div
      className={`${classes.root} ${active ? classes.active : ""} ${
        completed ? classes.completed : ""
      }`}
      onClick={onClick}
      style={
        !active && !completed
          ? { background: "rgba(30,41,59,0.95)", color: "#bae6fd" }
          : null
      }
    >
      {icon}
    </div>
  );
};

const CheckoutSteps = ({ activeStep }) => {
  const classes = useStyles();
  const history = useHistory();

  const steps = [
    { label: "BAG", icon: "1", link: "/cart" },
    { label: "DELIVERY", icon: "2", link: "/shipping" },
    { label: "PAYMENT", icon: "3", link: "/process/payment" },
    { label: "ORDER COMPLETE", icon: "4", link: "/success" },
  ];

  const handleStepClick = (stepIndex) => {
    if (stepIndex < activeStep) {
      history.push(steps[stepIndex].link);
    }
  };

  return (
    <div className={classes.stepReader}>
      <Stepper
        activeStep={activeStep}
        connector={<ColorlibConnector />}
        className={classes.stepperOverride} // <-- override applied here
      >
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              StepIconComponent={ColorlibStepIcon}
              onClick={() => handleStepClick(index)}
              className={classes.stepLabel}
            >
              {step.label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

export default CheckoutSteps;
