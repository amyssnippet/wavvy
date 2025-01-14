import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

export const EditBookingDrawer = ({ open, onClose, onUpdate, appointmentId }) => {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    services: [],
    staff: "",
    client_appointments: "",
    appointment_date: "",
    appointment_time: "",
    status: "Scheduled",
    payment_status: "Pending",
    pay_mode: "Offline",
    notes: "",
  });

  useEffect(() => {
    if (appointmentId) {
      fetchAppointmentDetails();
    }
  }, [appointmentId]);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/appointments/${appointmentId}/`
      );
      const data = await response.json();
      setFormData(data);

      // Fetch related data for dropdowns
      const businessId = localStorage.getItem("businessId");
      const businessResponse = await fetch(
        `http://127.0.0.1:8000/api/business/${businessId}/`
      );
      const businessData = await businessResponse.json();
      setServices(businessData.business_services || []);
      setStaff(businessData.business_team_members || []);
      setClients(businessData.clients || []);
    } catch (err) {
      console.error("Failed to fetch appointment details:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/appointments/${appointmentId}/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        alert("Appointment updated successfully!");
        onUpdate();
        onClose();
      } else {
        const errorData = await response.json();
        alert("Failed to update appointment: " + JSON.stringify(errorData));
      }
    } catch (err) {
      console.error("Error updating appointment:", err);
      alert("An error occurred while updating the appointment.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Edit Appointment</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label>Service</label>
            <Select
              value={formData.services[0] || ""}
              onValueChange={(value) => handleInputChange("services", [value])}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.service_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label>Assign Staff</label>
            <Select
              value={formData.staff || ""}
              onValueChange={(value) => handleInputChange("staff", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select staff" />
              </SelectTrigger>
              <SelectContent>
                {staff.map((member) => (
                  <SelectItem key={member.id} value={member.id}>
                    {member.first_name} {member.last_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label>Client</label>
            <Select
              value={formData.client_appointments || ""}
              onValueChange={(value) =>
                handleInputChange("client_appointments", value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.client_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label>Date</label>
              <Input
                type="date"
                value={formData.appointment_date}
                onChange={(e) =>
                  handleInputChange("appointment_date", e.target.value)
                }
              />
            </div>
            <div className="space-y-2">
              <label>Time</label>
              <Input
                type="time"
                value={formData.appointment_time}
                onChange={(e) =>
                  handleInputChange("appointment_time", e.target.value)
                }
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="bg-purple-600" onClick={handleSubmit}>
            Update Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBookingDrawer;
