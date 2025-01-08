"use client";

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

const CreateAppointment = ({ open, onClose, onCreate }) => {
  const [services, setServices] = useState([]);
  const [staff, setStaff] = useState([]);
  const [clients, setClients] = useState([]);
  const [formData, setFormData] = useState({
    service: "",
    staff: "",
    client: "",
    date: "",
    time: "",
  });

  useEffect(() => {
    fetchServices();
    fetchStaff();
    fetchClients();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/services/");
      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    }
  };

  const fetchStaff = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/team/");
      const data = await response.json();
      setStaff(data);
    } catch (err) {
      console.error("Failed to fetch staff:", err);
    }
  };

  const fetchClients = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/clients/");
      const data = await response.json();
      setClients(data);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/appointments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert("Appointment created successfully!");
        onCreate();
        onClose();
      } else {
        alert("Failed to create appointment.");
      }
    } catch (err) {
      console.error("Error creating appointment:", err);
      alert("An error occurred while creating the appointment.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create Appointment</DialogTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X />
            </Button>
          </div>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label>Service</label>
            <Select
              onValueChange={(value) => handleInputChange("service", value)}
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
              onValueChange={(value) => handleInputChange("client", value)}
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
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label>Time</label>
              <Input
                type="time"
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <Button className="bg-purple-600" onClick={handleSubmit}>
            Create Appointment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAppointment;
