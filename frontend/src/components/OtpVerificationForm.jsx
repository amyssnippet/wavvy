import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";

export function OtpVerificationForm({ onBack }) {
  const location = useLocation();
  const navigate = useNavigate();
  const phoneNumber = location.state?.phoneNumber || ""; // Retrieve phone number from state
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const handleChange = (index, value) => {
    if (value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if value is entered
      if (value && index < 3) {
        inputRefs[index + 1].current?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const otpCode = otp.join(""); // Combine all digits into a single OTP code
    const formattedPhoneNumber = phoneNumber.startsWith("IN")
      ? phoneNumber
      : `IN${phoneNumber}`; // Ensure phone number includes the "IN" prefix

    try {
      // Step 1: Verify OTP
      const otpResponse = await axios.post(
        "http://127.0.0.1:8000/api/verify-otp/",
        {
          phone_number: formattedPhoneNumber,
          otp: otpCode,
        }
      );

      if (otpResponse.data.message === "OTP verified successfully") {
        console.log("OTP verified!");

        // Step 2: Check if business exists
        const businessResponse = await axios.post(
          "http://127.0.0.1:8000/api/check-business/",
          { phone_number: formattedPhoneNumber }
        );

        if (businessResponse.data.exists) {
          localStorage.setItem(
            "business_id",
            businessResponse.data.business_id
          ); // Save business ID
          navigate("/dashboard"); // Redirect to dashboard
        } else {
          navigate("/register", {
            state: { phone_number: formattedPhoneNumber },
          }); // Redirect to registration
        }
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      setError(
        err.response?.data?.error || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setLoading(true);
      const resendResponse = await axios.post(
        "http://127.0.0.1:8000/api/send-otp/",
        { phone_number: phoneNumber }
      );
      if (resendResponse.data.message === "OTP sent successfully.") {
        alert("OTP resent successfully!");
      } else {
        alert("Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error resending OTP:", err.response?.data || err.message);
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!phoneNumber) {
    return (
      <p className="text-sm text-center text-red-500">
        Phone number is missing. Please go back and try again.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <p className="text-sm text-center mb-4">
        Enter the code sent to{" "}
        <span className="font-medium">{phoneNumber}</span>
      </p>
      <div className="flex justify-center gap-4">
        {otp.map((digit, index) => (
          <Input
            key={index}
            ref={inputRefs[index]}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className="w-14 h-14 text-center text-2xl"
          />
        ))}
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      <p className="text-sm text-center">
        I didn't receive any code.{" "}
        <button
          type="button"
          onClick={handleResend}
          className="text-purple-600 hover:underline font-medium"
        >
          RESEND
        </button>
      </p>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {loading ? "Verifying..." : "VERIFY"}
      </Button>

      <Button
        type="button"
        onClick={onBack}
        className="w-full"
        variant="outline"
      >
        Back
      </Button>
    </form>
  );
}
