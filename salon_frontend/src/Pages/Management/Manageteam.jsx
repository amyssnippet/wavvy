import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, PenIcon, TrashIcon } from "lucide-react";
import { Navbar } from "../Components/Navbar";
import { InviteDrawer } from "@/Pages/Components/TeamInvite";
import { EditTeamDrawer } from "@/Pages/Components/TeamEdit";

export function ManageTeam() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  useEffect(() => {
    async function fetchTeamData() {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/team/");
        if (response.ok) {
          const data = await response.json();
          setTeamMembers(data);
        } else {
          console.error("Failed to fetch team data");
        }
      } catch (error) {
        console.error("Error fetching team data:", error);
      }
    }
    fetchTeamData();
  }, []);

  const addTeamMember = (newMember) => {
    setTeamMembers((prev) => [...prev, newMember]);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this team member?");
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://127.0.0.1:8000/api/team/${id}/`, {
        method: "DELETE",
      });

      if (response.ok) {
        setTeamMembers((prev) => prev.filter((member) => member.id !== id));
        alert("Team member deleted successfully.");
      } else {
        console.error("Failed to delete team member");
        alert("Failed to delete team member. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting team member:", error);
      alert("An error occurred while deleting the team member.");
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsEditDrawerOpen(true);
  };

  const updateTeamMember = (updatedMember) => {
    setTeamMembers((prev) =>
      prev.map((member) =>
        member.id === updatedMember.id ? updatedMember : member
      )
    );
  };

  return (
    <div>
      <Navbar />
      <div className="p-8">
        <div className="flex items-center mb-4 justify-between">
          <div className="flex flex-col mb-7">
            <span className="text-black font-bold text-3xl">Manage team</span>
            <span className="text-gray-500 font-thin text-xl">View and manage your team members</span>
          </div>
          <Button
            variant="secondary"
            className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-2 rounded-lg"
            onClick={() => setIsDrawerOpen(true)}
          >
            Invite
          </Button>
        </div>
        <div className="w-full bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="flex items-center mb-4 space-x-4 p-5">
            <Input
              type="text"
              placeholder="Search"
              className="flex-grow p-3 border border-gray-300 rounded-lg"
            />
          </div>
          <table className="min-w-full bg-white">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Team Member</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Phone Number</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Email Address</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Date of Joining</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Access Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-800">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teamMembers.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4 text-sm">{member.first_name} {member.last_name}</td>
                  <td className="px-6 py-4 text-sm">{member.phone_number}</td>
                  <td className="px-6 py-4 text-sm">{member.member_email}</td>
                  <td className="px-6 py-4 text-sm">{member.date_of_joining}</td>
                  <td className="px-6 py-4 text-sm">{member.access_type}</td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => handleEdit(member)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <PenIcon className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDelete(member.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <InviteDrawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} addTeamMember={addTeamMember} />
      <EditTeamDrawer
        open={isEditDrawerOpen}
        onOpenChange={setIsEditDrawerOpen}
        teamMember={editingMember}
        updateTeamMember={updateTeamMember}
      />
    </div>
  );
}
