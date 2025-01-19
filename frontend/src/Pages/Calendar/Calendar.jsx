import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "../Components/Navbar";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import GoogleCalendar from "../Components/GoogleCalenderLike";
import { useNavigate } from "react-router-dom";
import { APIURL } from "@/url.config";

export default function Calendarr() {
  const [date, setDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [appointmentsForSelectedDate, setAppointmentsForSelectedDate] =
    useState([]);
  const businessId = localStorage.getItem("businessId");
  const navigate = useNavigate();

  useEffect(() => {
    const businessId = localStorage.getItem("businessId");
    if (!businessId) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    async function fetchAppointments() {
      try {
        const response = await fetch(`${APIURL}/api/business/${businessId}`); // Adjust the endpoint as per your backend
        const data = await response.json();

        // Extract and format appointments
        const formattedAppointments = data.business_appointments.map(
          (appointment) => {
            const client = data.clients.find(
              (client) => client.id === appointment.client_appointments
            );
            const staff = data.business_team_members.find(
              (member) => member.id === appointment.staff
            );
            const service = data.business_services.find(
              (service) => service.id === appointment.services[0]
            );

            return {
              id: appointment.id,
              clientName: client?.client_name || "Unknown",
              serviceName: service?.service_name || "Unknown Service",
              staffName: `${staff?.first_name || ""} ${staff?.last_name || ""}`,
              appointmentDate: appointment.appointment_date,
              appointmentTime: appointment.appointment_time,
            };
          }
        );

        setAppointments(formattedAppointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    }

    fetchAppointments();
  }, [businessId]);

  // Filter appointments for the selected date
  useEffect(() => {
    const selectedDate = date.toISOString().split("T")[0];
    const filteredAppointments = appointments.filter(
      (appointment) => appointment.appointmentDate === selectedDate
    );
    setAppointmentsForSelectedDate(filteredAppointments);
  }, [date, appointments]);

  return (
    <div>
      <Navbar />
      <div className="p-8 bg-white">
        <div className="flex items-center mb-4 justify-between py-8">
          <div className="flex flex-col mb-7">
            <span className="text-black font-bold text-3xl">Calendar</span>
            <span className="text-gray-500 font-thin text-xl">
              View all the activity
            </span>
          </div>
        </div>

        <div className="mt-8 flex space-x-4">
          <div className="w-full">
            <Card className="w-full p-2">
              <CardContent className="p-0 m-0">
                <CardDescription>January - June 2024</CardDescription>
                <GoogleCalendar />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border bg-white outline outline-1 outline-gray-200"
              renderDay={(day, modifiers) => {
                const dayString = day.toISOString().split("T")[0];
                const hasAppointment = appointments.some(
                  (appointment) => appointment.appointmentDate === dayString
                );

                return (
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      hasAppointment ? "bg-purple-200" : ""
                    }`}
                  >
                    {day.getDate()}
                  </div>
                );
              }}
            />
            <Card className="outline outline-1 outline-gray-200">
              <CardHeader>
                <CardTitle>Appointments for {date.toDateString()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointmentsForSelectedDate.length > 0 ? (
                    appointmentsForSelectedDate.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex justify-between items-center"
                      >
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage
                              src="https://via.placeholder.com/50"
                              alt={appointment.clientName}
                            />
                            <AvatarFallback>
                              {appointment.clientName[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">
                              {appointment.clientName}
                            </p>
                            <p className="text-sm text-gray-500">
                              {appointment.serviceName}
                            </p>
                            <p className="text-sm text-gray-400">
                              Staff: {appointment.staffName}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          {appointment.appointmentTime}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">
                      No appointments for this day.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
