import React, { useEffect } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ExitToApp as LogoutIcon } from "@material-ui/icons";
import { Link } from "react-router-dom";
// import "./Profile.css"; // Remove old CSS import
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../actions/userAction";
import { useAlert } from "react-alert";

const glassBox = {
  background: "rgba(15, 23, 42, 0.85)",
  borderRadius: "24px",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  backdropFilter: "blur(18px)",
  WebkitBackdropFilter: "blur(18px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  padding: "2.5rem 2rem",
  margin: "2rem auto",
  color: "#e0e7ef",
  maxWidth: "1100px",
  width: "95%",
  display: "flex",
  flexDirection: "row",
  gap: "2.5rem",
};

const leftBox = {
  flex: 1.2,
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  background: "rgba(30, 41, 59, 0.85)",
  borderRadius: "18px",
  padding: "2rem 1.5rem",
  minWidth: "270px",
  boxShadow: "0 4px 24px 0 rgba(30, 41, 59, 0.18)",
};

const rightBox = {
  flex: 2,
  display: "flex",
  flexDirection: "column",
  background: "rgba(30, 41, 59, 0.7)",
  borderRadius: "18px",
  padding: "2rem 2rem",
  minWidth: "320px",
  boxShadow: "0 4px 24px 0 rgba(30, 41, 59, 0.12)",
};

const avatarStyle = {
  width: "110px",
  height: "110px",
  margin: "0 auto 1.5rem auto",
  boxShadow: "0 4px 24px 0 rgba(59, 130, 246, 0.25)",
  border: "3px solid #3b82f6",
  background: "#0f172a",
};

const headingStyle = {
  fontWeight: 800,
  fontSize: "2rem",
  letterSpacing: "-0.5px",
  marginBottom: "0.5rem",
  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  backgroundClip: "text",
};

const subHeadingStyle = {
  fontWeight: 600,
  fontSize: "1.1rem",
  color: "#60a5fa",
  marginTop: "1.5rem",
  marginBottom: "0.5rem",
  letterSpacing: "0.02em",
};

const labelStyle = {
  fontWeight: 500,
  color: "#a5b4fc",
  fontSize: "1rem",
  marginBottom: "0.2rem",
};

const valueStyle = {
  fontWeight: 400,
  color: "#e0e7ef",
  fontSize: "1.08rem",
  marginBottom: "0.7rem",
  wordBreak: "break-all",
};

const buttonStyle = {
  background: "linear-gradient(135deg, #3b82f6, #2563eb)",
  color: "#fff",
  borderRadius: "16px",
  fontWeight: 700,
  fontSize: "1rem",
  padding: "12px 28px",
  margin: "1.2rem 0 0 0",
  boxShadow: "0 8px 25px rgba(59, 130, 246, 0.18)",
  textTransform: "none",
  letterSpacing: "0.5px",
};

const ProfilePage = () => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const history = useHistory();
  const { user, isAuthenticated } = useSelector((state) => state.userData);

  const logoutHandler = () => {
    dispatch(logout());
    alert.success("Logged out successfully");
    history.push("/login");
  };
  useEffect(() => {
    if (isAuthenticated === false) {
      history.push("/login");
    }
  }, [history, isAuthenticated]);

  const createdAt = (user) => {
    const createdAt = new Date(user.createdAt);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    };
    const formatter = new Intl.DateTimeFormat("en-IN", options);
    const formattedDate = formatter.format(createdAt);
    return formattedDate;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        fontFamily: "'Inter', 'Poppins', sans-serif",
        paddingTop: "7rem",
        paddingBottom: "2rem",
      }}
    >
      <div style={glassBox}>
        {/* Left Side */}
        <div style={leftBox}>
          <Avatar
            alt={user.name}
            src={user.avatar.url}
            style={avatarStyle}
          />
          <Typography style={headingStyle}>
            Hi, {user.name}!
          </Typography>
          <Typography style={{ color: "#a5b4fc", marginBottom: "2rem" }}>
            Welcome back! Happy shopping!
          </Typography>
          <div>
            <Typography style={subHeadingStyle}>Profile Overview</Typography>
            <div>
              <div style={labelStyle}>Name</div>
              <div style={valueStyle}>{user.name}</div>
              <div style={labelStyle}>Email</div>
              <div style={valueStyle}>{user.email}</div>
              <div style={labelStyle}>Member since</div>
              <div style={valueStyle}>{createdAt(user)}</div>
            </div>
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <Typography style={subHeadingStyle}>Orders</Typography>
            <Link
              to="/orders"
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained" style={buttonStyle}>
                Orders
              </Button>
            </Link>
          </div>
        </div>
        {/* Right Side */}
        <div style={rightBox}>
          <Typography style={subHeadingStyle}>Personal Information</Typography>
          <Typography style={{ color: "#a5b4fc", marginBottom: "1.5rem" }}>
            Hey there! Feel free to edit any of your details below so your account is up to date.
          </Typography>
          <div>
            <Typography style={subHeadingStyle}>My Details</Typography>
            <div style={labelStyle}>Name</div>
            <div style={valueStyle}>{user.name}</div>
            <div style={labelStyle}>Email</div>
            <div style={valueStyle}>{user.email}</div>
            {/* Add more fields as needed */}
            <Link to="/profile/update" style={{ textDecoration: "none" }}>
              <Button variant="contained" style={buttonStyle}>
                Edit Details
              </Button>
            </Link>
          </div>
          <div>
            <Typography style={subHeadingStyle}>Login Details</Typography>
            <div style={labelStyle}>Email</div>
            <div style={valueStyle}>{user.email}</div>
            <div style={labelStyle}>Password</div>
            <div style={valueStyle}>*************</div>
            <Link
              to="/password/update"
              style={{ textDecoration: "none" }}
            >
              <Button variant="contained" style={buttonStyle}>
                Update Password
              </Button>
            </Link>
          </div>
          <div style={{ marginTop: "2.5rem" }}>
            <Typography style={subHeadingStyle}>Log out from all devices</Typography>
            <Typography style={{ color: "#a5b4fc", marginBottom: "1rem" }}>
              To access the Cricket Weapon Store website again, you need to provide your credentials. This action will log you out from any other web browsers you have used before.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              style={buttonStyle}
              startIcon={<LogoutIcon />}
              onClick={logoutHandler}
            >
              Logout Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProfilePage;
