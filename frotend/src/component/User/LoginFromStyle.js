import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  formContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: "8rem",
    paddingBottom: "3rem",
    height: "auto",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    fontFamily: "'Inter', 'Poppins', sans-serif",
    position: "relative",
    minHeight: "100vh",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: "url('/path-to-auth-background.jpg')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundAttachment: "fixed",
      opacity: 0.3,
      pointerEvents: "none",
    },
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background:
        "radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(37, 99, 235, 0.1) 0%, transparent 50%)",
      pointerEvents: "none",
    },
  },
  form: {
    width: "450px",
    margin: "auto",
    borderRadius: "24px",
    padding: "3rem 2.5rem",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(20px)",
    boxShadow: "0 25px 50px rgba(0, 0, 0, 0.3)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    position: "relative",
    overflow: "hidden",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    zIndex: 1,
    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: "0 35px 70px rgba(0, 0, 0, 0.4)",
      background: "rgba(255, 255, 255, 0.15)",
    },
  },

  heading: {
    textAlign: "center",
    marginBottom: theme.spacing(4),
    background: "linear-gradient(135deg, #3b82f6, #2563eb)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
    fontWeight: "800",
    fontFamily: "'Inter', sans-serif",
    fontSize: "32px",
    position: "relative",
    letterSpacing: "-0.5px",
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-10px",
      left: "50%",
      transform: "translateX(-50%)",
      width: "60px",
      height: "3px",
      background: "linear-gradient(90deg, #3b82f6, #2563eb)",
      borderRadius: "2px",
    },
  },

  textField: {
    marginBottom: theme.spacing(3),
    fontFamily: "'Inter', sans-serif",
    "& .MuiOutlinedInput-root": {
      borderRadius: "16px",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      background: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "blur(10px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      "&:hover": {
        background: "rgba(255, 255, 255, 0.15)",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(0, 0, 0, 0.2)",
      },
      "&:hover fieldset": {
        borderColor: "#3b82f6",
        borderWidth: "2px",
      },
      "& .MuiOutlinedInput-input": {
        padding: "16px 18px",
        fontFamily: "'Inter', sans-serif",
        fontSize: "16px",
        fontWeight: "400",
        color: "#FFFFFF",
        "&::placeholder": {
          color: "rgba(255, 255, 255, 0.6)",
          opacity: 1,
        },
      },
      "&.Mui-focused": {
        background: "rgba(255, 255, 255, 0.2)",
        transform: "translateY(-2px)",
        boxShadow: "0 8px 25px rgba(59, 130, 246, 0.2)",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3b82f6",
        borderWidth: "2px",
        boxShadow: "0 0 0 4px rgba(59, 130, 246, 0.1)",
      },
      "& fieldset": {
        borderColor: "rgba(255, 255, 255, 0.2)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      fontFamily: "'Inter', sans-serif",
      fontWeight: "500",
      fontSize: "14px",
      "&.Mui-focused": {
        color: "#3b82f6",
        fontWeight: "600",
      },
    },
  },

  passwordInput: {
    position: "relative",
    "& > label": {
      left: ".2rem",
    },
    width: "100%",
    marginTop: theme.spacing(5.5),
    "& .MuiOutlinedInput-input": {
      padding: "18px 18px",
      fontSize: "16px",
      fontFamily: "'Inter', sans-serif",
      color: "#FFFFFF",
    },
  },

  strengthIndicator: {
    marginTop: theme.spacing(1),
  },

  showPasswordButton: {
    position: "absolute",
    top: "50%",
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: "12px",
    right: theme.spacing(2),
    transform: "translateY(-50%)",
    border: "none",
    "&:hover": {
      color: "#84CC16",
      background: "none",
    },
  },
  rememberMeContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "14px",
    marginTop: theme.spacing(7),
    "& .MuiIconButton-label": {
      color: "#FFFFFF",
    },
  },
  forgotPasswordLink: {
    color: "rgba(255, 255, 255, 0.8)",
    textDecoration: "none",
    transition: "all 0.3s ease",
    "&:hover": {
      textDecoration: "underline",
      color: "#84CC16",
    },
  },
  termsAndConditionsText: {
    fontFamily: "Inter",
    color: "rgba(255, 255, 255, 0.6)",
    textAlign: "center",
    lineHeight: "17px",
    paddingLeft: "4px",
    marginTop: theme.spacing(2),
    fontSize: "12px",
  },
  loginButton: {
    color: "#FFFFFF !important",
    background: "linear-gradient(135deg, #3b82f6, #2563eb) !important",
    border: "none !important",
    borderRadius: "16px !important",
    padding: "16px 24px !important",
    fontWeight: "700 !important",
    fontSize: "16px !important",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important",
    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3) !important",
    fontFamily: "'Inter', sans-serif !important",
    margin: `${theme.spacing(3)}px 0`,
    marginTop: "2rem",
    textTransform: "none !important",
    letterSpacing: "0.5px !important",
    position: "relative !important",
    overflow: "hidden !important",
    backdropFilter: "blur(10px) !important",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
      transition: "left 0.5s",
    },
    "&:hover::before": {
      left: "100%",
    },
    "&:disabled": {
      background:
        "linear-gradient(135deg, #666666, #444444) !important",
      color: "rgba(255, 255, 255, 0.5) !important",
      boxShadow: "none !important",
      transform: "none !important",
    },
    "&:hover": {
      background:
        "linear-gradient(135deg, #2563eb, #1d4ed8) !important",
      transform: "translateY(-3px) scale(1.02) !important",
      boxShadow: "0 15px 40px rgba(37, 99, 235, 0.4) !important",
    },
    "&:active": {
      transform: "translateY(-1px) scale(0.98) !important",
    },
  },

  privacyText: {
    marginLeft: "4px",
    textDecoration: "underline",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: "14px",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#84CC16",
    },
  },
  createAccount: {
    fontSize: "1rem",
    fontWeight: 500,
    color: "rgba(255, 255, 255, 0.9)",
    paddingLeft: "6px",
    transition: "color 0.3s ease",
    "&:hover": {
      color: "#84CC16",
      textDecoration: "underline",
    },
  },

  // input text Filed
  textField: {
    marginBottom: theme.spacing(2),
    fontFamily: "'Inter', sans-serif",
    "& .MuiOutlinedInput-root": {
      borderRadius: "15px",
      transition: "all 0.3s ease",
      background: "rgba(255, 255, 255, 0.05)",
      "&:hover fieldset": {
        borderColor: "#3b82f6",
      },
      "& .MuiOutlinedInput-input": {
        padding: "14px 16px",
        fontFamily: "'Inter', sans-serif",
        color: "#FFFFFF",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#3b82f6",
        boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)",
      },
    },
    "& .MuiInputLabel-root": {
      color: "rgba(255, 255, 255, 0.7)",
      fontFamily: "'Inter', sans-serif",
      "&.Mui-focused": {
        color: "#3b82f6",
      },
    },
  },

  // signUp

  avatar: {
    margin: " 8px auto",
    backgroundColor: "black",
  },
  gridcheckbox: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: "3rem",
  },
  checkbox: {
    "& .MuiTypography-body1": {
      fontSize: "14px",
    },
    marginTop: theme.spacing(1),
    "& .MuiIconButton-label": {
      color: "black",
    },
  },

  // image uploader
  root: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "3.5rem",
  },
  avatar2: {
    marginLeft: "6px",
    backgroundColor: "black",
    "&.MuiAvatar-colorDefault": {
      color: "#fff",
      backgroundColor: "black",
    },
    "&:hover": {
      backgroundColor: "#ed1c24",
    },
  },
  input: {
    display: "none",
  },

  // Update and create product styles ====================>>

  updateProduct: {
    display: "flex",
    alignItems: "flex-start",
    backgroundColor: "#f1f1f1",
    justifyContent: "center",
    width: "100%",
    gap: "1rem",
    overflow: "hidden",
    margin: "-1.1rem 0 0 0",
    padding: 0,
  },
  firstBox1: {
    width: "20%",
    margin: "0rem",
    height: "fit-content",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    display: "block",
    [theme.breakpoints.down("999")]: {
      display: "none",
    },
  },

  toggleBox1: {
    width: "16rem",
    margin: "0rem",
    height: "fit-content",
    backgroundColor: "white",
    borderRadius: "5px",
    boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.5)",
    display: "block",
    zIndex: "100",
    position: "absolute",
    top: "58px",
    left: "17px",
  },
  secondBox1: {
    width: "75%",
    backgroundColor: "#f1f1f1",
    height: "fit-content",
    display: "flex",
    flexDirection: "column",
    margin: "-0.5rem 0 0 0",
    gap: "10px",
    justifyContent: "center",
    [theme.breakpoints.down("999")]: {
      width: "100%",
    },
  },
  navBar1: {
    margin: "0rem",
  },

  form2: {
    marginTop: "-6rem",
  },
  uploadAvatarButton: {
    color: "#FFFFFF !important",
    background: "linear-gradient(135deg, #3b82f6, #2563eb) !important",
    borderRadius: "16px !important",
    padding: "14px 28px !important",
    fontWeight: "700 !important",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important",
    boxShadow: "0 8px 25px rgba(59, 130, 246, 0.3) !important",
    fontFamily: "'Inter', sans-serif !important",
    textTransform: "none !important",
    position: "relative !important",
    overflow: "hidden !important",
    backdropFilter: "blur(10px) !important",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: "-100%",
      width: "100%",
      height: "100%",
      background:
        "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)",
      transition: "left 0.5s",
    },
    "&:hover::before": {
      left: "100%",
    },
    "&:hover": {
      background:
        "linear-gradient(135deg, #2563eb, #1d4ed8) !important",
      transform: "translateY(-3px) scale(1.02) !important",
      boxShadow: "0 15px 40px rgba(37, 99, 235, 0.4) !important",
    },
  },

  uploadAvatarText: {
    fontSize: "14px",
    backgroundColor: "inherit",
    fontWeight: 500,
    color: "#fff",

    padding: "0 1rem",
  },

  imgIcon: {
    width: "auto",
    marginLeft: "1rem",
    alignSelf: "center",
    "& svg": {
      color: "#414141",
      fontSize: "2.5rem !important",
      boxShadow: `0px 4px 10px rgba(0, 0, 0, 0.3)`,
    },
  },

  descriptionInput: {
    marginTop: theme.spacing(5.5),
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "black",
        color: "black",
      },
      "&:hover fieldset": {
        borderColor: "black",
        color: "black",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
        color: "black",
        outline: "none",
      },
    },
    "& .MuiOutlinedInput-input": {
      padding: "13px 8px",
    },
    "& .MuiInputLabel-root": {
      color: "black",
      fontSize: "14px",
      textAlign: "center",
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "black",
      fontSize: "14px",
      textAlign: "center",
    },
  },
  descriptionIcon: {
    marginRight: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  selectOption: {
    marginTop: theme.spacing(5.5),
    position: "relative",
    width: "100%",
  },

  imageArea: {
    display: "flex",
    gap: "18px",
    width: "90%",
    overflowX: "scroll",
    scrollbarWidth: "10px",
    margin: "2rem 0",
    "&::-webkit-scrollbar": {
      width: "10px",
      height: "5px",
    },
    padding: "3px 16px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.shape.borderRadius,
  },
  image: {
    width: "4.5rem ",
    height: "4rem ",
    objectFit: "cover",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    borderRadius: theme.shape.borderRadius,
  },
  labelText: {
    color: "#414141",
    fontSize: "14px",
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    left: "14px",
    pointerEvents: "none",
    opacity: (props) => (props.category ? 0 : 1),
    transition: "opacity 0.3s ease",
  },
  formControl: {
    width: "100%",
  },
  select: {
    "& .MuiOutlinedInput-input": {
      padding: "13px 8px",
    },
    "& .MuiInputLabel-outlined": {
      pointerEvents: "none",
      fontSize: "14px",
      textAlign: "center",
      color: "#414141",
    },
    "& .MuiOutlinedInput-root": {
      "&:hover fieldset": {
        borderColor: "#ed1c24",
      },
      "&.Mui-focused fieldset": {
        borderColor: "black",
        outlineColor: "black",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "black",
      },
    },
    "& .MuiSelect-root": {
      padding: "10px",
      color: "black",
    },
    "& .MuiSelect-icon": {
      marginRight: "-4px",
      color: "gray",
    },
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "black",
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#ed1c24",
      color: "white",
    },
  },

  menu: {
    marginTop: theme.spacing(1),
    "& .MuiMenuItem-root": {
      color: "black",
    },
    "& .MuiMenuItem-root:hover": {
      backgroundColor: "#ed1c24",
      color: "white",
    },
  },
  guestLink: {
    display: "block",
    margin: "2rem auto 0 auto",
    textAlign: "center",
    color: "#3b82f6",
    textDecoration: "underline",
    fontWeight: 600,
    fontSize: "1.05rem",
    cursor: "pointer",
    background: "none",
    border: "none",
    outline: "none",
    padding: 0,
    "&:hover": {
      color: "#2563eb",
      textDecoration: "underline",
    },
  },
}));

export default useStyles;
