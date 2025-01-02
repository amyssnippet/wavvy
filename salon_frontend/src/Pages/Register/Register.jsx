import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import logo from "../../assets/logo.svg";
import r from "../../assets/regsiter.svg";

export function Register() {
  const [ownerName, setOwnerName] = useState("");
  const [salonName, setSalonName] = useState("");
  const [email, setEmail] = useState("");
  const [gst, setGst] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profileImg, setProfileImg] = useState(null);  // State for image file

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("owner_name", ownerName);
    formData.append("salon_name", salonName);
    formData.append("owner_email", email);
    formData.append("phone_number", phoneNumber);
    formData.append("gst", gst);
    formData.append("salon_description", description);
    formData.append("location", location);
    if (profileImg) {
      formData.append("profile_img", profileImg);
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/business/", {
        method: "POST",
        headers: {
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create business");
      }

      const responseData = await response.json();
      console.log("Business created:", responseData);
      // Handle success (e.g., navigate to another page or show a success message)
    } catch (error) {
      console.error("Error:", error);
      // Handle error (e.g., show an error message)
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
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <select
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          >
            <option value="">Select location</option>
            <option value="location1">Location 1</option>
            <option value="location2">Location 2</option>
            <option value="location3">Location 3</option>
          </select>
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
