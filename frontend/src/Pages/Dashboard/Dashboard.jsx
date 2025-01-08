import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "../../components/ui/card";
import { Navbar } from "../Components/Navbar";

const Dashboard = () => {
  const [businessData, setBusinessData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBusinessData = async () => {
    const phoneNumber = localStorage.getItem("phoneNumber");
    const token = localStorage.getItem("access_token");

    if (!token) {
      console.error("Access token not found. Redirecting to login.");
      navigate("/login");
      return;
    }

    try {
      console.log("Fetching business for phone:", phoneNumber);

      // Step 1: Check if the business exists
      const checkBusinessResponse = await fetch(
        "http://127.0.0.1:8000/api/check-business/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token here
          },
          body: JSON.stringify({ phone_number: phoneNumber }),
        }
      );

      const checkBusinessData = await checkBusinessResponse.json();
      console.log("Check Business Response:", checkBusinessData);

      if (!checkBusinessData.exists) {
        console.log("Business not found for phone:", phoneNumber);
        setBusinessData(null);
        return;
      }

      const businessId = checkBusinessData.business.id;

      // Step 2: Fetch full business details
      const businessResponse = await fetch(
        `http://127.0.0.1:8000/api/business/${businessId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Include the token here
          },
        }
      );

      const businessDetails = await businessResponse.json();
      console.log("Business Details:", businessDetails);
      setBusinessData(businessDetails);
    } catch (error) {
      console.error("Error fetching business data:", error);
      setBusinessData(null);
    }
  };


  useEffect(() => {
    fetchBusinessData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <Navbar username={businessData?.owner_name || "User"} />
      <div className="p-6 space-y-6">
        {businessData ? (
          <>
            <div className="grid grid-cols-4 gap-5">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Salon Name
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{businessData.salon_name}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Owner Name
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{businessData.owner_name}</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    Total Employees
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{businessData.team_members.length || 0}</p>
                </CardContent>
              </Card>
            </div>
          </>
        ) : (
          <p>No business data found. Please create a business profile.</p>
        )}
      </div>
    </>
  );
};

export default Dashboard;
