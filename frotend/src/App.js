// App.jsx
import React, { useState, useEffect, Suspense, useCallback } from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { load_UserProfile } from "./actions/userAction";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CricketBallLoader from "./component/layouts/loader/Loader";
import PrivateRoute from "./component/Route/PrivateRoute";
import { SpeedInsights } from '@vercel/speed-insights/react';
import "./App.css";

import Header from "./component/layouts/Header1.jsx/Header";
import Payment from "./component/Cart/Payment";
import Home from "./component/Home/Home";
import Services from "./Terms&Condtions/Service";
import Footer from "./component/layouts/Footer/Footer";
import ProductDetails from "./component/Product/ProductDetails";
import Products from "./component/Product/Products";
import Signup from "./component/User/SignUp";
import Login from "./component/User/Login";
import Profile from "./component/User/Profile";
import UpdateProfile from "./component/User/UpdateProfile";
import UpdatePassword from "./component/User/UpdatePassword";
import ForgetPassword from "./component/User/ForgetPassword";
import ResetPassword from "./component/User/ResetPassword";
import Shipping from "./component/Cart/Shipping";
import Cart from "./component/Cart/Cart";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrder from "./component/order/MyOrder";
import ContactForm from "./Terms&Condtions/Contact";
import AboutUsPage from "./Terms&Condtions/Aboutus";
import ReturnPolicyPage from "./Terms&Condtions/Return";
import TermsUse from "./Terms&Condtions/TermsAndUse";
import TermsAndConditions from "./Terms&Condtions/TermsCondtion";
import PrivacyPolicy from "./Terms&Condtions/Privacy";
import ApiTester from "./component/Debug/ApiTester";
// import ProfileModal from "./component/layouts/Header1.jsx/ProfileModel"; // unused in your snippet

// Lazy loading admin components
const LazyDashboard = React.lazy(() => import("./component/Admin/Dashboard"));
const LazyProductList = React.lazy(() => import("./component/Admin/ProductList"));
const LazyOrderList = React.lazy(() => import("./component/Admin/OrderList"));
const LazyUserList = React.lazy(() => import("./component/Admin/UserList"));
const LazyUpdateProduct = React.lazy(() => import("./component/Admin/UpdateProduct"));
const LazyProcessOrder = React.lazy(() => import("./component/Admin/ProcessOrder"));
const LazyUpdateUser = React.lazy(() => import("./component/Admin/UpdateUser"));
const LazyNewProduct = React.lazy(() => import("./component/Admin/NewProduct"));
const LazyProductReviews = React.lazy(() => import("./component/Admin/ProductReviews"));

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
axios.defaults.baseURL = API_BASE_URL;

function App() {
  const [stripeApiKey, setStripeApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();

  // Get STRIPE_API_KEY for payment from backend
  const getStripeApiKey = useCallback(async () => {
    try {
      const { data } = await axios.get("/api/v1/stripeapikey");
      const key = data?.stripeApiKey ?? "";
      if (key) {
        sessionStorage.setItem("stripeApiKey", JSON.stringify(key));
        setStripeApiKey(key);
      } else {
        setStripeApiKey("");
      }
    } catch (error) {
      console.error("Error fetching Stripe API key:", error);
      setStripeApiKey("");
    }
  }, []);

  // Load user profile only if there's a token in localStorage
  const loadUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        await dispatch(load_UserProfile());
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [dispatch]);

  useEffect(() => {
    const initializeApp = async () => {
      // Try to reuse Stripe key from session storage
      const storedStripeKey = sessionStorage.getItem("stripeApiKey");
      if (storedStripeKey) {
        try {
          setStripeApiKey(JSON.parse(storedStripeKey));
        } catch (error) {
          console.error("Error parsing stored Stripe key:", error);
          sessionStorage.removeItem("stripeApiKey");
        }
      } else {
        await getStripeApiKey();
      }

      // load user profile if token exists
      await loadUserProfile();

      // Done initializing
      setIsLoading(false);
    };

    initializeApp();
  }, [getStripeApiKey, loadUserProfile]);

  // Set up axios interceptor for handling 401 errors
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          delete axios.defaults.headers.common["Authorization"];
          console.log("Authentication expired. Please login again.");
          // you can add a redirect here if you want
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, []);

  const AdminHeaderHider = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith("/admin");
    return (
      <>
        {!isAdminRoute && <Header />}
        {children}
      </>
    );
  };

  if (isLoading) {
    return <CricketBallLoader />;
  }

  const stripePromise = stripeApiKey ? loadStripe(stripeApiKey) : null;

  return (
    <Router>
      <SpeedInsights />
      <AdminHeaderHider>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/product/:id" component={ProductDetails} />
          <Route exact path="/products" component={Products} />
          <Route path="/products/:keyword" component={Products} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/password/forgot" component={ForgetPassword} />
          <Route exact path="/password/reset/:token" component={ResetPassword} />
          <Route exact path="/cart" component={Cart} />
          <Route exact path="/contact" component={ContactForm} />
          <Route exact path="/about_us" component={AboutUsPage} />

          {/* Policy routes */}
          <Route exact path="/policy/return" component={ReturnPolicyPage} />
          <Route exact path="/policy/Terms" component={TermsUse} />
          <Route exact path="/policy/privacy" component={PrivacyPolicy} />
          <Route exact path="/terms/conditions" component={TermsAndConditions} />

          {/* Private routes (user) */}
          <PrivateRoute exact path="/account" component={Profile} />
          <PrivateRoute exact path="/profile/update" component={UpdateProfile} />
          <PrivateRoute exact path="/password/update" component={UpdatePassword} />
          <PrivateRoute exact path="/orders" component={MyOrder} />
          <PrivateRoute exact path="/shipping" component={Shipping} />
          <PrivateRoute exact path="/order/confirm" component={ConfirmOrder} />
          <PrivateRoute exact path="/success" component={OrderSuccess} />

          {/* Payment route: always render Payment UI, pass stripePromise as prop */}
          <Route
            exact
            path="/process/payment"
            render={props => (
              stripePromise ? (
                <Elements stripe={stripePromise}>
                  <Payment {...props} />
                </Elements>
              ) : (
                <Payment {...props} stripeUnavailable />
              )
            )}
          />

          {/* Admin routes (lazy loaded) */}
          <Suspense fallback={<CricketBallLoader />}>
            <PrivateRoute isAdmin={true} exact path="/admin/dashboard" component={LazyDashboard} />
            <PrivateRoute isAdmin={true} exact path="/admin/products" component={LazyProductList} />
            <PrivateRoute isAdmin={true} exact path="/admin/product/:id" component={LazyUpdateProduct} />
            <PrivateRoute isAdmin={true} exact path="/admin/reviews" component={LazyProductReviews} />
            <PrivateRoute isAdmin={true} exact path="/admin/orders" component={LazyOrderList} />
            <PrivateRoute isAdmin={true} exact path="/admin/order/:id" component={LazyProcessOrder} />
            <PrivateRoute isAdmin={true} exact path="/admin/new/product" component={LazyNewProduct} />
            <PrivateRoute isAdmin={true} exact path="/admin/users" component={LazyUserList} />
            <PrivateRoute isAdmin={true} exact path="/admin/user/:id" component={LazyUpdateUser} />
          </Suspense>

          {/* Debug / API tester */}
          <Route exact path="/api-test" component={ApiTester} />

          {/* fallback route could go here (optional) */}
        </Switch>
        <Footer />
      </AdminHeaderHider>
    </Router>
  );
}

export default App;
