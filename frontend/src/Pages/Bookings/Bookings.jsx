import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navbar } from "../Components/Navbar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { PenIcon, TrashIcon } from "lucide-react";
import CreateAppointment from "../Components/AddBookingDrawer";

export function Bookings() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Fetch appointments from the API
  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/appointments/");
      if (!response.ok) throw new Error("Failed to fetch appointments");
      const data = await response.json();
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this appointment?"))
      return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/appointments/${id}/`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) throw new Error("Failed to delete appointment");
      fetchAppointments();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <div className="flex items-center mb-4 justify-between p-8">
          <div className="flex flex-col mb-7">
            <span className="text-black font-bold text-3xl">Appointments</span>
            <span className="text-gray-500 font-thin text-xl">
              View, create, and manage client appointments
            </span>
          </div>
          <div className="space-x-4">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-purple-600 text-white hover:bg-purple-700 px-4 py-2 rounded-lg"
            >
              Create Appointment
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-xl rounded-lg">
          {loading ? (
            <div className="text-center py-10">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-10">{error}</div>
          ) : (
            <Table className="w-full bg-white shadow-xl rounded-lg">
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Pay Mode</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Staff</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      {appointment.client_appointments?.client_name ||
                        "Unknown"}
                    </TableCell>
                    <TableCell>
                      {appointment.client_appointments?.client_phone || "N/A"}
                    </TableCell>
                    <TableCell>{appointment.pay_mode}</TableCell>
                    <TableCell>
                      {appointment.services
                        ?.map((service) => service.service_name)
                        .join(", ") || "No Services"}
                    </TableCell>
                    <TableCell>
                      {appointment.staff
                        ? `${appointment.staff.first_name} ${appointment.staff.last_name}`
                        : "Unassigned"}
                    </TableCell>
                    <TableCell>{appointment.appointment_date}</TableCell>
                    <TableCell>{appointment.appointment_time}</TableCell>
                    <TableCell className="flex space-x-2">
                      <button
                        className="text-blue-500 hover:underline"
                        // onClick={() => setEditModalOpen(appointment)}
                      >
                        <PenIcon size={20} />
                      </button>
                      <button
                        className="text-red-500 hover:underline"
                        onClick={() => handleDelete(appointment.id)}
                      >
                        <TrashIcon size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      {/* Add Booking Modal */}
      <CreateAppointment
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onCreate={() => {
          setIsAddModalOpen(false);
          fetchAppointments(); // Refresh the list
        }}
      />
    </div>
  );
}
