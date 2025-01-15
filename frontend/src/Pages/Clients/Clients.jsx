import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "../Components/Navbar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Link } from "react-router-dom";
import { Calendar, Pen, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import AddClientDrawer from "../Components/AddClients";
import { useNavigate } from "react-router-dom";

export default function ClientsList() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [businessId, setBusinessId] = useState(
    localStorage.getItem("businessId")
  );

  useEffect(() => {
    const businessId = localStorage.getItem("businessId");
    if (!businessId) {
      navigate("/login");
    }
  }, [navigate]);
  
  // Function to toggle drawer visibility
  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Fetch clients data from the API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/business/${businessId}/`
        );
        const data = await response.json();
        setClients(data.clients);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching clients:", error);
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [businessId]);

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <div className="flex items-center mb-4 justify-between p-8">
          <div className="flex flex-col mb-7">
            <span className="text-black font-bold text-3xl">Clients List</span>
            <span className="text-gray-500 font-thin text-xl">
              view, add, edit and delete your client's details.
            </span>
          </div>
          <div className="space-x-4">
            <Link to="/bookings">
              <Button className="border-purple-600" variant="outline">
                Back to Appointments
              </Button>
            </Link>
            <Button
              onClick={toggleDrawer} // Open the AddClientDrawer
              variant="secondary"
              className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-2 rounded-lg"
            >
              Add Clients
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg">
          <div className="flex space-x-4 p-7">
            <Input
              type="text"
              placeholder="Search by name, email or mobile number"
              className="flex-grow p-5 rounded-lg shadow-lg"
            />
            <Input
              type="text"
              placeholder="Filters"
              className="flex-grow p-5 rounded-lg shadow-lg"
            />
            <Button
              variant="outline"
              className="bg-purple-600 text-white hover:bg-purple-700 px-8 py-2 rounded-lg"
            >
              Export
            </Button>
          </div>

          {isLoading ? (
            <div className="p-5">Loading...</div>
          ) : (
            <Table className="w-full bg-white shadow-2xl rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-black">Client Name</TableHead>
                  <TableHead className="text-black">Phone number</TableHead>
                  <TableHead className="text-black">Email address</TableHead>
                  <TableHead className="text-black">Client Type</TableHead>
                  <TableHead className="text-black">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="flex items-center space-x-4">
                      <span>{client.client_name}</span>
                    </TableCell>
                    <TableCell>{client.client_phone}</TableCell>
                    <TableCell>{client.client_email}</TableCell>
                    <TableCell>{client.client_type}</TableCell>
                    <TableCell className="flex space-x-2">
                      <button className="text-black">
                        <Pen className="w-4 h-4" />
                      </button>
                      <button className="text-black">
                        <Calendar className="w-4 h-4" />
                      </button>
                      <button className="text-black">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add Client Drawer */}
      <AddClientDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} />
    </div>
  );
}
