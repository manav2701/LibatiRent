import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  Services_section: {
    backgroundColor: "#000",
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
    fontFamily: "'Roboto', sans-serif",
  },
  Services_wrapper: {
    display: "flex",
    gap: "2.5rem",
    width: "100%",
    flexWrap: "wrap",
    height: "auto",
    paddingTop: "20px",
    justifyContent: "center",
  },
  Services_card: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: theme.spacing(1),
    padding: theme.spacing(2),
    marginLeft: "1rem",
    marginBottom: theme.spacing(2),
  },
  Services_icon: {
    color: "#ed1c24",
    fontSize: "3rem",
    marginRight: theme.spacing(2.5),
    "& svg": {
      fontSize: "3rem !important",
    },
  },
  Services_cardTitle: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  Services_cardInfo: {
    color: "rgba(255, 255, 255, 0.7)",
    fontWeight: 300,
    fontSize: "0.8rem",
  },
}));

const Services = () => {
  const classes = useStyles();

  return null;
};

export default Services;
