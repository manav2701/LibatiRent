import React from "react";
import { Link } from "react-router-dom";
import MetaData from "../component/layouts/MataData/MataData";

const sectionStyle = {
  background: "rgba(15,23,42,0.95)",
  color: "#e0e7ef",
  borderRadius: 18,
  boxShadow: "0 8px 32px 0 rgba(59,130,246,0.18)",
  padding: "2.5rem 2rem",
  margin: "2rem auto",
  maxWidth: 900,
  fontFamily: "'Poppins', sans-serif",
  lineHeight: 1.7,
};

const whiteSectionStyle = {
  background: "#fff",
  color: "#181c24",
  borderRadius: 18,
  boxShadow: "0 8px 32px 0 rgba(59,130,246,0.10)",
  padding: "2.5rem 2rem",
  margin: "2rem auto",
  maxWidth: 900,
  fontFamily: "'Poppins', sans-serif",
  lineHeight: 1.7,
};

const headingStyle = {
  color: "#38bdf8",
  fontWeight: 800,
  fontSize: "2.2rem",
  letterSpacing: "1px",
  marginBottom: "1.2rem",
  textAlign: "center",
  textShadow: "0 2px 12px #0ea5e9a0",
};

const subHeadingStyle = {
  color: "#bae6fd",
  fontWeight: 700,
  fontSize: "1.2rem",
  marginTop: "2rem",
  marginBottom: "0.5rem",
};

const PrivacyPolicy = () => {
  return (
    <div style={{ background: "#0f172a", minHeight: "100vh", padding: "2rem 0" }}>
      <MetaData title={"Privacy Policy"} />
      <div style={sectionStyle}>
        <h1 style={headingStyle}>Privacy Policy of Libati Sports Rental</h1>
        <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#bae6fd" }}>
          Effective Date: 02/09/2025
        </p>
        <div style={whiteSectionStyle}>
          <p>
            At <b>Libati Sports Rental</b>, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services. By accessing or using our website and services, you acknowledge that you have read, understood, and agree to be bound by all the terms outlined in this Privacy Policy.
          </p>
        </div>
        <h2 style={subHeadingStyle}>1. Information We Collect</h2>
        <h3 style={{ color: "#38bdf8", marginTop: "1rem" }}>1.1 Personal Information:</h3>
        <div style={whiteSectionStyle}>
          <p>
            We may collect personal information that you voluntarily provide to us when you register an account, place an order, subscribe to our newsletter, participate in contests or surveys, or contact us for support. This information may include your name, email address, phone number, shipping address, billing address, and payment details.
          </p>
        </div>
        <h3 style={{ color: "#38bdf8", marginTop: "1rem" }}>1.2 Non-Personal Information:</h3>
        <div style={whiteSectionStyle}>
          <p>
            When you interact with our website, we may collect non-personal information about your device, browsing actions, and usage patterns. This information may include your IP address, browser type, operating system, referring URLs, and interactions with our website.
          </p>
        </div>
        <h2 style={subHeadingStyle}>2. Use of Information</h2>
        <h3 style={{ color: "#38bdf8", marginTop: "1rem" }}>2.1 Personal Information:</h3>
        <div style={whiteSectionStyle}>
          <p>We may use the personal information we collect to:</p>
          <ul style={{ color: "#181c24" }}>
            <li>Process and fulfill your orders</li>
            <li>Provide customer support and respond to inquiries</li>
            <li>
              Send you promotional offers, newsletters, and marketing communications (you can opt-out at any time)
            </li>
            <li>Improve our website, products, and services</li>
            <li>Personalize your experience on our website</li>
            <li>
              Prevent fraudulent activities and ensure the security of our platform
            </li>
          </ul>
        </div>
        <h3 style={{ color: "#38bdf8", marginTop: "1rem" }}>2.2 Non-Personal Information:</h3>
        <div style={whiteSectionStyle}>
          <p>
            We may use non-personal information for various purposes, including:
          </p>
          <ul style={{ color: "#181c24" }}>
            <li>Analyzing trends and user behavior</li>
            <li>Monitoring and improving the functionality of our website</li>
            <li>Customizing content and advertisements</li>
            <li>Generating aggregated statistical data</li>
          </ul>
        </div>
        <h2 style={subHeadingStyle}>3. Disclosure of Information</h2>
        <div style={whiteSectionStyle}>
          <p>
            We may disclose your information to third parties in the following circumstances:
          </p>
          <ul style={{ color: "#181c24" }}>
            <li>
              To our trusted service providers who assist us in operating our business and providing services to you
            </li>
            <li>
              To comply with legal obligations, enforce our policies, or respond to legal requests
            </li>
            <li>
              In the event of a merger, acquisition, or sale of all or a portion of our business assets
            </li>
            <li>With your consent or at your direction</li>
          </ul>
        </div>
        <h2 style={subHeadingStyle}>4. Security</h2>
        <div style={whiteSectionStyle}>
          <p>
            We take reasonable measures to protect your information from unauthorized access, disclosure, alteration, or destruction. However, please note that no method of transmission over the internet or electronic storage is completely secure, and we cannot guarantee absolute security.
          </p>
        </div>
        <h2 style={subHeadingStyle}>5. Children's Privacy</h2>
        <div style={whiteSectionStyle}>
          <p>
            Our website and services are not intended for children under the age of 13. We do not knowingly collect personal information from children. If we become aware that we have collected personal information from a child without parental consent, we will take steps to remove that information from our servers.
          </p>
        </div>
        <h2 style={subHeadingStyle}>6. Changes to This Privacy Policy</h2>
        <div style={whiteSectionStyle}>
          <p>
            We may update our Privacy Policy from time to time. Any changes will be posted on this page, and the revised Privacy Policy will take effect immediately upon posting. We encourage you to review this Privacy Policy periodically for any updates or changes.
          </p>
        </div>
        <h2 style={subHeadingStyle}>7. Contact Us</h2>
        <div style={whiteSectionStyle}>
          <p>
            If you have any questions, concerns, or suggestions regarding this Privacy Policy, please contact us at{" "}
            <Link to="/contact" style={{ textDecoration: "underline", color: "#3b82f6", fontWeight: 700 }}>
              support@libati.com
            </Link>
            .
          </p>
        </div>
        <p style={{ color: "#bae6fd", marginTop: "2rem", textAlign: "center" }}>
          By using the Libati Sports Rental website and services, you agree to the collection, use, and disclosure of your information as described in this Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
