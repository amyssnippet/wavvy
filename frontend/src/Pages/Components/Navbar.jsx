import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom"; // Use NavLink instead of Link
import { useState } from "react";

export function Navbar() {
  return (
    <nav className="flex justify-between items-center bg-white shadow-md p-4">
      <div className="flex space-x-8">
        <span className="text-xl font-semibold">WAVVE</span>
        <div className="flex space-x-4">
          <NavLink
            to="/"
            className="button-nav"
            activeClassName="bg-indigo-600 text-white"
          >
            <Button variant="ghost">Home</Button>
          </NavLink>
          <NavLink
            to="/calendar"
            className="button-nav"
            activeClassName="bg-indigo-600 text-white"
          >
            <Button variant="ghost">Calendar</Button>
          </NavLink>
          <NavLink
            to="/sales"
            className="button-nav"
            activeClassName="bg-indigo-600 text-white"
          >
            <Button variant="ghost">Sales</Button>
          </NavLink>
          <NavLink
            to="/bookings"
            className="button-nav"
            activeClassName="bg-indigo-600 text-white"
          >
            <Button variant="ghost">Bookings</Button>
          </NavLink>
          <NavLink
            to="/manage-team"
            className="button-nav"
            activeClassName="bg-indigo-600 text-white"
          >
            <Button variant="ghost">My Team</Button>
          </NavLink>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-sm">Akash Verma</span>
        <div className="flex items-center space-x-2">
        </div>
      </div>
    </nav>
  );
}
