import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation after success
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "../../assets/logo.svg";
import r from "../../assets/regsiter.svg";
import { APIURL } from "@/url.config";

export function Register() {
  const [ownerName, setOwnerName] = useState("");
  const [salonName, setSalonName] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number
  const [profileImg, setProfileImg] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Fetch phone number from localStorage
  useEffect(() => {
    const storedPhoneNumber = localStorage.getItem("phoneNumberStored");
    if (storedPhoneNumber) {
      setPhoneNumber(storedPhoneNumber); // Set phone number state from localStorage
    } else {
      setError("No phone number found in localStorage. Please log in again.");
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("owner_name", ownerName);
    formData.append("salon_name", salonName);
    formData.append("owner_email", email);
    formData.append("phone_number", phoneNumber);
    formData.append("gst", gst);
    formData.append("salon_description", description);
    if (profileImg) {
      formData.append("profile_img", profileImg);
    }

    try {
      const response = await fetch(`${APIURL}/api/business/`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error response data:", errorData);
        throw new Error(
          errorData.detail ||
            "Failed to create business. Please check your inputs."
        );
      }

      const responseData = await response.json();
      console.log("Business created:", responseData);

      // Store business ID in localStorage
      if (responseData.id) {
        localStorage.setItem("businessId", responseData.id);
      }

      setSuccess("Business created successfully!");
      setError("");

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error.message);
      setError(error.message || "An error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* Left Section */}
      <div className="flex-[40%] bg-[#f9f9f9] p-6 flex flex-col items-center">
        <nav className="w-full mb-8">
          <img src={logo} alt="Logo" />
        </nav>
        <div className="flex flex-col justify-center items-center space-y-4 mt-8">
          <div className="flex justify-center mb-4 mt-40">
            <img src={r} alt="Salon Icon" className="h-24" />
          </div>
          <h2 className="text-2xl font-semibold">Setup your salon</h2>
          <p className="text-gray-500 text-center">
            Please fill in the details to set up your salon.
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex-[60%] p-8 flex flex-col justify-center items-center bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
          <h2 className="text-xl font-bold mb-4">Salon Setup</h2>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-500">{success}</p>}
          <Input
            type="text"
            placeholder="Owner name"
            className="w-full"
            value={ownerName}
            onChange={(e) => setOwnerName(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Salon name"
            className="w-full"
            value={salonName}
            onChange={(e) => setSalonName(e.target.value)}
          />
          <Input
            type="email"
            placeholder="you@company.com"
            className="w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Eg. 12ABCD3456E1Z2 (optional)"
            className="w-full"
            value={gst}
            onChange={(e) => setGst(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Phone number"
            className="w-full"
            value={phoneNumber}
            readOnly // Makes the field read-only
          />
          <textarea
            placeholder="Enter a description..."
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
          <Input
            type="file"
            onChange={(e) => setProfileImg(e.target.files[0])}
            className="w-full"
          />
          <Button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700"
          >
            Complete setup
          </Button>
        </form>
      </div>
    </div>
  );
}
