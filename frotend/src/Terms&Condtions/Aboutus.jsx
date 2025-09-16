import React from "react";
import { Typography, Container, Grid, Button } from "@mui/material";
import { makeStyles } from "@mui/styles";
import MetaData from "../component/layouts/MataData/MataData";
import LibatiLogo from "../Image/about/Libati.png";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const useStyles = makeStyles((theme) => ({
  about_us: {
    paddingTop: "8rem",
    paddingBottom: "4rem",
    background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
  },

  container_12: {
    padding: "3rem 2rem",
    textAlign: "center",
    background: "white",
    maxWidth: "100%",
    borderRadius: "20px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1)",
    margin: "2rem 0",
    border: "1px solid rgba(255, 0, 191, 0.1)",
  },

  image_about: {
    width: "100%",
    height: "auto",
    marginTop: "2rem",
    marginBottom: "2rem",
    borderRadius: "15px",
    boxShadow: "0 15px 40px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.3s ease",
    "&:hover": {
      transform: "scale(1.02)",
    },
  },

  title_about: {
    color: "#1e3a8a !important",
    fontSize: "36px !important",
    padding: "2rem 1rem",
    fontFamily: "'Inter', 'Roboto', sans-serif !important",
    fontWeight: "700 !important",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "10px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "100px",
      height: "4px",
      background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
      borderRadius: "2px",
    },
  },

  heading12_about: {
    fontSize: "28px !important",
    padding: "2rem 1rem",
    fontWeight: "600 !important",
    color: "#1e3a8a !important",
    textAlign: "center",
    fontFamily: "'Inter', 'Roboto', sans-serif !important",
  },

  introText_about: {
    maxWidth: "900px",
    lineHeight: "1.8",
    margin: "2rem 0",
    color: "#2c2c2c !important",
    fontSize: "18px !important",
    fontWeight: "400 !important",
    textAlign: "justify",
    padding: "1rem 2rem",
    fontFamily: "'Inter', 'Roboto', sans-serif !important",
  },

  infoText_about: {
    lineHeight: "1.8",
    margin: "2rem 0",
    color: "#444 !important",
    fontSize: "16px !important",
    fontWeight: "400 !important",
    textAlign: "justify",
    padding: "1rem 2rem",
    fontFamily: "'Inter', 'Roboto', sans-serif !important",
  },

  buttonContainer_about: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem 0",
    width: "100%",
    marginTop: "2rem",
    gap: "1rem",
    flexWrap: "wrap",
  },

  button1_about: {
    background: "linear-gradient(135deg, #1e3a8a, #3b82f6) !important",
    color: "white !important",
    padding: "15px 30px !important",
    borderRadius: "50px !important",
    fontWeight: "600 !important",
    fontSize: "16px !important",
    textTransform: "none !important",
    boxShadow: "0 10px 30px rgba(30, 58, 138, 0.3) !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      background: "#3b82f6 !important",
      transform: "translateY(-2px)",
      boxShadow: "0 15px 40px rgba(59, 130, 246, 0.4) !important",
    },
  },

  button2_about: {
    background: "transparent !important",
    color: "#1e3a8a !important",
    border: "2px solid #1e3a8a !important",
    padding: "13px 28px !important",
    borderRadius: "50px !important",
    fontWeight: "600 !important",
    fontSize: "16px !important",
    textTransform: "none !important",
    transition: "all 0.3s ease !important",
    "&:hover": {
      background: "#1e3a8a !important",
      color: "white !important",
      transform: "translateY(-2px)",
      boxShadow: "0 15px 40px rgba(30, 58, 138, 0.4) !important",
    },
  },
}));

const About_UsPage = () => {
  const classes = useStyles();

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      <div className={classes.about_us}>
        <MetaData title={"About Libati - Sports Rental Platform"} />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Container className={classes.container_12}>
            <Grid container spacing={4} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={6}>
                <motion.img
                  variants={itemVariants}
                  src={LibatiLogo}
                  alt="Libati Sports Rental"
                  className={classes.image_about}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div variants={itemVariants}>
                  <Typography
                    variant="h2"
                    component="h1"
                    className={classes.title_about}
                  >
                    About Libati
                  </Typography>
                  <Typography variant="body1" className={classes.introText_about}>
                    Libati is a revolutionary sports rental platform specializing in tennis and padel equipment.
                    Founded in 2019, we've transformed the way athletes access premium sports gear by making
                    high-quality equipment affordable and accessible through our innovative rental service.
                  </Typography>
                  <Typography variant="body1" className={classes.introText_about}>
                    Our mission is simple: democratize access to professional-grade tennis and padel equipment.
                    Whether you're a weekend warrior or a competitive athlete, Libati ensures you have access
                    to the best gear without the hefty price tag of ownership.
                  </Typography>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Container className={classes.container_12}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h3"
                component="h2"
                className={classes.heading12_about}
              >
                Who We Are
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography variant="body1" className={classes.infoText_about}>
                Libati is dedicated to revolutionizing sports equipment access through our comprehensive
                rental platform. We specialize in premium tennis and padel gear, offering everything from
                professional rackets to complete equipment sets for players of all skill levels.
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography variant="body1" className={classes.infoText_about}>
                Since our inception, we've built a community of over 25,000 satisfied customers who trust
                us for their sporting needs. Our carefully curated inventory features top brands and the
                latest innovations in tennis and padel equipment, all maintained to professional standards.
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography variant="body1" className={classes.infoText_about}>
                At Libati, we believe sports should be accessible to everyone. Our rental model eliminates
                the barrier of expensive equipment purchases while ensuring you always have access to the
                latest and greatest gear. Join thousands of athletes who've made Libati their go-to sports partner.
              </Typography>
            </motion.div>
          </Container>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Container className={classes.container_12}>
            <motion.div variants={itemVariants}>
              <Typography
                variant="h3"
                component="h2"
                className={classes.heading12_about}
              >
                Our Mission
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography variant="body1" className={classes.infoText_about}>
                Libati is driven by the mission to make premium tennis and padel equipment accessible
                to athletes worldwide through our innovative rental platform. We aim to break down
                financial barriers while promoting sustainability in sports.
              </Typography>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Typography variant="body1" className={classes.infoText_about}>
                We're committed to providing exceptional service, maintaining equipment to the highest
                standards, and continuously expanding our inventory to meet the evolving needs of our
                community. Every rental supports our vision of inclusive, sustainable sports participation.
              </Typography>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className={classes.buttonContainer_about}
            >
              <Link
                to="/products"
                style={{ textDecoration: "none" }}
              >
                <Button variant="contained" className={classes.button1_about}>
                  Explore Equipment
                </Button>
              </Link>
              <Link
                to="/contact"
                style={{ textDecoration: "none" }}
              >
                <Button variant="outlined" className={classes.button2_about}>
                  Contact Us
                </Button>
              </Link>
            </motion.div>
          </Container>
        </motion.div>
      </div>
    </>
  );
};

export default About_UsPage;
