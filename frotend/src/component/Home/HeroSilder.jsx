import React, { useRef, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import heroVideo from "../../Image/Cricket-wepon/7.mp4";

const useStyles = makeStyles((theme) => ({
  heroContainer: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    zIndex: 1,
    transform: "scale(1)",
    transformOrigin: "center center",
    // REMOVE THIS LINE: pointerEvents: "none", 
    // ADD THIS INSTEAD:
    pointerEvents: "auto", // Critical fix - allow initial events
  },
  videoBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transform: "scale(1)",
    transformOrigin: "center center",
    pointerEvents: "none", // Prevent video from blocking clicks
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background:
      "linear-gradient(135deg, rgba(30, 58, 138, 0.7) 0%, rgba(220, 38, 38, 0.3) 80%)",
    transform: "scale(1)",
    transformOrigin: "center center",
    pointerEvents: "none", // Prevent overlay from blocking clicks
  },
  content: {
    position: "absolute",
    top: "50%",
    left: "5%",
    transform: "translateY(-50%) scale(1)",
    transformOrigin: "left center",
    zIndex: 10010, // Increased z-index to ensure it's above overlay and statsCard
    color: "#ffffff",
    maxWidth: "500px",
    pointerEvents: "auto",
    // ADD THIS CRITICAL FIX:
    touchAction: "manipulation", // Fixes mobile touch issues
  },
  mainTitle: {
    fontSize: "4rem",
    fontWeight: "900",
    lineHeight: "0.9",
    marginBottom: "1rem",
    color: "#ffffff",
    textShadow: "0 4px 8px rgba(0, 0, 0, 0.7)",
    fontFamily: "'Inter', sans-serif",
    letterSpacing: "-0.02em",
    wordBreak: "keep-all",
    hyphens: "none",
  },
  subtitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#3b82f6",
    marginBottom: "1.5rem",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    letterSpacing: "0.1em",
  },
  description: {
    fontSize: "1.1rem",
    lineHeight: 1.6,
    marginBottom: "2rem",
    color: "rgba(255, 255, 255, 0.9)",
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
    maxWidth: "400px",
  },
  exploreButton: {
    background: "linear-gradient(135deg, #1e3a8a, #3b82f6)",
    color: "#ffffff",
    borderRadius: "50px",
    padding: "1rem 2.5rem",
    fontSize: "1.1rem",
    fontWeight: "700",
    cursor: "pointer",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.75rem",
    textDecoration: "none",
    fontFamily: "'Inter', sans-serif",
    boxShadow: "0 10px 30px rgba(30, 58, 138, 0.4)",
    backdropFilter: "blur(6px)",
    textTransform: "none",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    whiteSpace: "nowrap",
    position: "relative", // Added for proper stacking
    zIndex: 1100, // Higher z-index for button
    "&:hover": {
      transform: "translateY(2px)",
      boxShadow: "0 15px 40px rgba(30, 58, 138, 0.6)",
      background: "linear-gradient(135deg, #3b82f6, #1e3a8a)",
    },
  },
  statsCard: {
    position: "absolute",
    top: "20%",
    right: "5%",
    background: "rgba(30, 58, 138, 0.2)",
    backdropFilter: "blur(20px)",
    border: "1px solid rgba(59, 130, 246, 0.3)",
    borderRadius: "20px",
    padding: "2rem",
    zIndex: 10,
    minWidth: "220px",
    textAlign: "center",
    animation: "$float 4s ease-in-out infinite",
    pointerEvents: "auto", // <-- allow interaction if needed
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
  statsNumber: {
    color: "#3b82f6",
    fontSize: "2.5rem",
    fontWeight: "900",
    margin: 0,
    textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
  },
  statsText: {
    color: "#cbd5e1",
    fontSize: "1rem",
    margin: 0,
    fontWeight: "600",
    marginTop: "0.5rem",
  },
  "@keyframes float": {
    "0%, 100%": {
      transform: "translateY(0px)",
    },
    "50%": {
      transform: "translateY(-15px)",
    },
  },
  newsTicker: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "3rem",
    background: "#f87171", // Lighter red for better text visibility
    zIndex: 10003,
    overflow: "hidden",
    display: "flex",
    alignItems: "center",
    boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.3)",
  },
  newsContent: {
    display: "flex",
    alignItems: "center",
    height: "100%",
    whiteSpace: "nowrap",
    animation: "$scroll 30s linear infinite",
    fontSize: "0.9rem",
    fontWeight: "600",
    color: "#ffffff",
    fontFamily: "'Inter', 'Poppins', sans-serif",
  },
  newsItem: {
    display: "inline-flex",
    alignItems: "center",
    marginRight: "3rem",
    color: "#ffffff",
    textShadow: "0 1px 2px rgba(0, 0, 0, 0.3)",
  },
  newsIcon: {
    marginRight: "0.5rem",
    fontSize: "1rem",
  },
  typewriter: {
    fontSize: "1.6rem",
    fontWeight: 700,
    color: "#3b82f6",
    fontFamily: "'Inter', 'Poppins', sans-serif",
    marginBottom: "1.2rem",
    letterSpacing: "0.08em",
    minHeight: "2.2rem",
    display: "inline-block",
    background: "rgba(255,255,255,0.08)",
    borderRadius: "8px",
    padding: "0.2em 1em",
    boxShadow: "0 2px 8px rgba(59,130,246,0.08)",
    position: "relative",
    zIndex: 10020,
    // Blinking cursor
    "&::after": {
      content: '""',
      display: "inline-block",
      width: "2px",
      height: "1.3em",
      background: "#3b82f6",
      marginLeft: "6px",
      verticalAlign: "middle",
      animation: "$blink 1s steps(1) infinite",
      position: "relative",
      top: "2px",
    },
  },
  "@keyframes blink": {
    "0%, 49%": { opacity: 1 },
    "50%, 100%": { opacity: 0 },
  },
  "@keyframes scroll": {
    "0%": {
      transform: "translateX(100%)",
    },
    "100%": {
      transform: "translateX(-100%)",
    },
  },
}));

export default function HeroSlider() {
  const classes = useStyles();
  const videoRef = useRef(null);

  // Sample news data - keep to 10 words or less
  const newsItems = [
    { id: 1, text: "New Tennis Rackets Available for Rent", icon: "🎾" },
    { id: 2, text: "50% Off Padel Equipment This Weekend", icon: "🏓" },
    { id: 3, text: "Premium Sports Gear Now in Stock", icon: "⭐" },
    { id: 4, text: "Book Your Equipment Online Today", icon: "📱" },
    { id: 5, text: "Free Delivery on Orders Above AED 100", icon: "🚚" },
    { id: 6, text: "Customer Rating: 4.9/5 Stars", icon: "⭐" },
    { id: 7, text: "Join 10,000+ Happy Sports Enthusiasts", icon: "🏆" },
  ];

  const smoothScrollToProducts = (e) => {
    e.preventDefault();
    const productsSection = document.querySelector('[data-section="products"]');
    if (productsSection) {
      productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // --- Typewriter Animation Logic ---
  const typewriterWords = ["sports rental", "rent now"];
  const [typewriterText, setTypewriterText] = useState("");
  const [typewriterIndex, setTypewriterIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout;
    const currentWord = typewriterWords[typewriterIndex];

    if (!isDeleting && charIndex <= currentWord.length) {
      setTypewriterText(currentWord.slice(0, charIndex));
      timeout = setTimeout(() => setCharIndex(charIndex + 1), 90);
    } else if (isDeleting && charIndex >= 0) {
      setTypewriterText(currentWord.slice(0, charIndex));
      timeout = setTimeout(() => setCharIndex(charIndex - 1), 40);
    } else if (!isDeleting && charIndex > currentWord.length) {
      timeout = setTimeout(() => setIsDeleting(true), 900);
    } else if (isDeleting && charIndex < 0) {
      setIsDeleting(false);
      setTypewriterIndex((typewriterIndex + 1) % typewriterWords.length);
      timeout = setTimeout(() => setCharIndex(0), 400);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, typewriterIndex]);

  return (
    <div className={classes.heroContainer}>
      <video
        ref={videoRef}
        className={classes.videoBackground}
        autoPlay
        muted={true} // Keep muted always
        loop
        playsInline
        preload="metadata" 
      >
        <source src={heroVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className={classes.overlay} />

      <div className={classes.content}>
        {/* Typewriter text above main title */}
        <div className={classes.typewriter}>{typewriterText}</div>
        <h1 className={classes.mainTitle}>
          MORE THAN
          <br />
          EQUIPMENT
        </h1>
        <p className={classes.subtitle}>SINCE 2024</p>
        <p className={classes.description}>
          Experience premium tennis and padel equipment through our innovative
          rental platform. Play like a pro without the price tag.
        </p>
        <Button
          className={classes.exploreButton}
          onClick={smoothScrollToProducts}
        >
          Explore Equipment
          <ArrowForwardIcon style={{ fontSize: "24px" }} />
        </Button>
      </div>

      <div className={classes.statsCard}>
        <h3 className={classes.statsNumber}>98%</h3>
        <p className={classes.statsText}>Satisfaction Rate</p>
      </div>

      {/* News Ticker Overlay */}
      <div className={classes.newsTicker}>
        <div className={classes.newsContent}>
          {newsItems.map((item) => (
            <span key={item.id} className={classes.newsItem}>
              <span className={classes.newsIcon}>{item.icon}</span>
              {item.text}
            </span>
          ))}
          {/* Duplicate for seamless loop */}
          {newsItems.map((item) => (
            <span key={`duplicate-${item.id}`} className={classes.newsItem}>
              <span className={classes.newsIcon}>{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}