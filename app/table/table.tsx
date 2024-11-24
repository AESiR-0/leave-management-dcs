"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // Assuming Shadcn button component is available
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Shadcn Select component

type LeaveRequest = {
  id: number;
  name: string;
  course: string;
  semester: number;
  contact: string;
  leaveCategory: string;
  status: "pending" | "approved" | "rejected";
};

export default function LeaveRequestsTable() {
  const [requests, setRequests] = useState<LeaveRequest[]>([
    {
      id: 1,
      name: "John Doe",
      course: "Computer Science",
      semester: 5,
      contact: "123-456-7890",
      leaveCategory: "Sick Leave",
      status: "pending",
    },
    {
      id: 2,
      name: "Jane Smith",
      course: "Mechanical Engineering",
      semester: 3,
      contact: "987-654-3210",
      leaveCategory: "Casual Leave",
      status: "pending",
    },
    {
      id: 3,
      name: "Sam Brown",
      course: "Electrical Engineering",
      semester: 7,
      contact: "555-123-4567",
      leaveCategory: "Annual Leave",
      status: "approved",
    },
  ]);

  const [selectedRequests, setSelectedRequests] = useState<number[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");

  // Handle bulk action selection
  const handleBulkActionChange = (value: string) => {
    setBulkAction(value);
  };

  // Handle bulk action submit
  const handleBulkActionSubmit = () => {
      if (!bulkAction) {
        alert("Please select a bulk action.");
        return;
      }
  
      const updatedRequests = requests.map((request) =>
        selectedRequests.includes(request.id)
          ? {
              ...request,
              status: bulkAction === "approve" ? "approved" : "rejected",
            }
          : request
      ) as LeaveRequest[];
  
      setRequests(updatedRequests);
      setSelectedRequests([]); // Clear selections after applying
      setBulkAction(""); // Reset bulk action
    };

  // Toggle selection for a request
  const handleSelectRequest = (id: number) => {
    setSelectedRequests((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle approve/reject for individual request
  const handleApproveReject = (id: number, action: "approve" | "reject") => {
      const updatedRequests = requests.map((request) =>
        request.id === id
          ? { ...request, status: action === "approve" ? "approved" : "rejected" }
          : request
      ) as LeaveRequest[];
      setRequests(updatedRequests);
    };

  // Handle details button click (could open a modal or redirect)
  const handleDetailsClick = (id: number) => {
    console.log("Open details for request ID:", id);
    // You can implement your modal or page navigation logic here
  };

  return (
    <div className="p-6 max-w-screen-xl mx-auto space-y-6">
      {/* Bulk Actions */}
      <div className="flex items-center space-x-4 mb-6">
        <Select value={bulkAction} onValueChange={handleBulkActionChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select action" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="approve">Approve</SelectItem>
            <SelectItem value="reject">Reject</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={handleBulkActionSubmit}
          disabled={selectedRequests.length === 0 || !bulkAction}
          className="bg-blue-600 text-white"
        >
          Apply Bulk Action
        </Button>
      </div>

      {/* Leave Requests Table */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRequests(requests.map((request) => request.id));
                  } else {
                    setSelectedRequests([]);
                  }
                }}
                checked={
                  selectedRequests.length > 0 &&
                  selectedRequests.length === requests.length
                }
              />
            </th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Course</th>
            <th className="px-4 py-2">Semester</th>
            <th className="px-4 py-2">Contact</th>
            <th className="px-4 py-2">Leave Category</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
            <th className="px-4 py-2">Details</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id} className="border-b">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedRequests.includes(request.id)}
                  onChange={() => handleSelectRequest(request.id)}
                />
              </td>
              <td className="px-4 py-2">{request.name}</td>
              <td className="px-4 py-2">{request.course}</td>
              <td className="px-4 py-2">{request.semester}</td>
              <td className="px-4 py-2">{request.contact}</td>
              <td className="px-4 py-2">{request.leaveCategory}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 rounded-full ${
                    request.status === "approved"
                      ? "bg-green-600 text-white"
                      : request.status === "rejected"
                      ? "bg-red-600 text-white"
                      : "bg-yellow-600 text-white"
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </td>
              <td className="px-4 py-2">
                <Button
                  onClick={() => handleApproveReject(request.id, "approve")}
                  className="bg-green-600 text-white"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleApproveReject(request.id, "reject")}
                  className="bg-red-600 text-white ml-2"
                >
                  Reject
                </Button>
              </td>
              <td className="px-4 py-2">
                <Button
                  onClick={() => handleDetailsClick(request.id)}
                  className="bg-blue-600 text-white"
                >
                  View Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
