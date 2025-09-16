import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Link } from "react-router-dom";
import img01 from "../../Image/Cricket-wepon/01.jpg";
import img02 from "../../Image/Cricket-wepon/02.jpg";
import img03 from "../../Image/Cricket-wepon/03.jpg";

const useStyles = makeStyles((theme) => ({
  imageStrip: {
    display: "flex",
    width: "100%",
    height: "300px",
    position: "relative",
    zIndex: 2,
    margin: 0,
    padding: 0,
    [theme.breakpoints.down("md")]: {
      height: "250px",
    },
    [theme.breakpoints.down("sm")]: {
      height: "200px",
    },
  },
  imageContainer: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "all 0.3s ease",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#ffffff",
    textAlign: "center",
    padding: "2rem",
    transition: "all 0.3s ease",
    "&:hover": {
      background: "linear-gradient(135deg, rgba(59, 130, 246, 0.5) 0%, rgba(239, 68, 68, 0.5) 100%)",
    },
  },
  overlayTitle: {
    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
    fontWeight: "800",
    marginBottom: "1rem",
    fontFamily: "'Inter', sans-serif",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.7)",
    [theme.breakpoints.down("sm")]: {
      fontSize: "clamp(1.2rem, 5vw, 1.8rem)",
      marginBottom: "0.5rem",
    },
  },
  overlayText: {
    fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
    fontWeight: "500",
    opacity: 0.9,
    fontFamily: "'Inter', sans-serif",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.5)",
    [theme.breakpoints.down("sm")]: {
      fontSize: "clamp(0.8rem, 2.5vw, 1rem)",
    },
  },
  clickableOverlay: {
    textDecoration: "none",
    color: "inherit",
    display: "block",
    width: "100%",
    height: "100%",
  },
}));

const ImageStrip = () => {
  const classes = useStyles();

  const imageData = [
    {
      src: img01,
      title: "Premium Equipment",
      text: "Discover our collection of professional-grade sports equipment",
      clickable: false,
    },
    {
      src: img02,
      title: "Expert Guidance",
      text: "Get personalized recommendations from our sports experts",
      clickable: true,
      link: "/contact",
    },
    {
      src: img03,
      title: "Rental Excellence",
      text: "Experience hassle-free rentals with flexible terms",
      clickable: false,
    },
  ];

  return (
    <div className={classes.imageStrip}>
      {imageData.map((item, index) => (
        <div key={index} className={classes.imageContainer}>
          <img
            src={item.src}
            alt={item.title}
            className={classes.image}
          />
          {item.clickable ? (
            <Link to={item.link} className={classes.clickableOverlay}>
              <div className={classes.overlay}>
                <h3 className={classes.overlayTitle}>{item.title}</h3>
                <p className={classes.overlayText}>{item.text}</p>
              </div>
            </Link>
          ) : (
            <div className={classes.overlay}>
              <h3 className={classes.overlayTitle}>{item.title}</h3>
              <p className={classes.overlayText}>{item.text}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageStrip;
