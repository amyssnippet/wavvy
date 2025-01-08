import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SearchPhone = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showOtpField, setShowOtpField] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/search-phone/", {
        phone_number: phoneNumber,
      });
      if (response.data.exists) {
        alert(
          `Welcome back! Redirecting to Dashboard for ${response.data.business.salon_name}`
        );
        navigate(response.data.redirect);
      } else {
        alert("No business found. Sending OTP for verification...");
        setShowOtpField(true); // Show OTP input field
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/verify-otp/",
        {
          phone_number: phoneNumber,
          otp: otp,
        }
      );
      if (response.data.message === "OTP verified successfully.") {
        alert("OTP verified! Redirecting...");
        navigate("/register"); // Navigate to /verifying
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while verifying the OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
      <h2>Search Business or Verify OTP</h2>
      {!showOtpField ? (
        <>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            style={{
              padding: "10px",
              width: "100%",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleSearch}
            disabled={loading || !phoneNumber}
            style={{
              padding: "10px 20px",
              background: "#007BFF",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            style={{
              padding: "10px",
              width: "100%",
              marginBottom: "10px",
              border: "1px solid #ccc",
              borderRadius: "4px",
            }}
          />
          <button
            onClick={handleVerifyOtp}
            disabled={loading || !otp}
            style={{
              padding: "10px 20px",
              background: "#28a745",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default SearchPhone;
