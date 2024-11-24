"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type LeaveRequest = {
  _id: string;
  name: string;
  course: string;
  semester: number;
  contact: string;
  leaveCategory: string;
  status: "pending" | "approved" | "rejected";
};

export default function LeaveRequestsTable() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>("");

  // Fetch leave requests from API
  useEffect(() => {
    const fetchRequests = async () => {
      const response = await fetch("/api/leave-requests");
      const data = await response.json();
      setRequests(data);
    };
    fetchRequests();
  }, []);

  // Handle bulk action selection
  const handleBulkActionChange = (value: string) => {
    setBulkAction(value);
  };

  // Handle bulk action submit
  const handleBulkActionSubmit = async () => {
    if (!bulkAction) {
      alert("Please select a bulk action.");
      return;
    }

    const response = await fetch("/api/leave-requests/bulk", {
      method: "PATCH",
      body: JSON.stringify({ selectedRequests, status: bulkAction }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (data.message === "Bulk action applied successfully") {
      setRequests((prev) =>
        prev.map((request) =>
          selectedRequests.includes(request._id)
            ? { ...request, status: bulkAction as "approved" | "rejected" }
            : request
        )
      );
    }
    setSelectedRequests([]);
    setBulkAction("");
  };

  // Toggle selection for a request
  const handleSelectRequest = (id: string) => {
    setSelectedRequests((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((selectedId) => selectedId !== id)
        : [...prevSelected, id]
    );
  };

  // Handle approve/reject for individual request
  const handleApproveReject = async (
    id: string,
    action: "approve" | "reject"
  ) => {
    const response = await fetch(`/api/leave-requests/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status: action }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (data.message === "Status updated successfully") {
      setRequests((prev) =>
        prev.map((request) =>
          request._id === id
            ? {
                ...request,
                status: action === "approve" ? "approved" : "rejected",
              }
            : request
        )
      );
    }
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
            <th className="px-4 py-2">
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedRequests(requests.map((request) => request._id));
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
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id} className="border-b">
              <td className="px-4 py-2">
                <input
                  type="checkbox"
                  checked={selectedRequests.includes(request._id)}
                  onChange={() => handleSelectRequest(request._id)}
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
                  onClick={() => handleApproveReject(request._id, "approve")}
                  className="bg-green-600 text-white"
                >
                  Approve
                </Button>
                <Button
                  onClick={() => handleApproveReject(request._id, "reject")}
                  className="bg-red-600 text-white ml-2"
                >
                  Reject
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
