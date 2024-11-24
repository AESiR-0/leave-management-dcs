"use client";

import { useState, useEffect } from "react";

// Predefined leave categories
const leaveCategories = [
  "Sick Leave",
  "Promotional for university",
  "Event Leave",
];

export default function LeaveForm() {
  const [leaveCategory, setLeaveCategory] = useState<string>(
    leaveCategories[0]
  );
  const [newCategory, setNewCategory] = useState<string>("");
  const [categories, setCategories] = useState<string[]>(leaveCategories);

  // Date related states
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [numDays, setNumDays] = useState<number>(0); // Automatically calculated days
  const [reason, setReason] = useState<string>(""); // Reason for leave

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLeaveCategory(e.target.value);
  };

  // Add a new leave category dynamically
  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories((prev) => [...prev, newCategory]);
      setNewCategory(""); // Clear input after adding
    }
  };

  // Handle date changes and calculate number of days
  useEffect(() => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if the dates are valid
      if (start && end && start <= end) {
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 3600 * 24)) + 1; // Including both start and end dates
        setNumDays(diffDays);
      } else {
        setNumDays(0); // Reset to 0 if dates are invalid
      }
    }
  }, [startDate, endDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prepare leave request data
    const leaveRequestData = {
      leaveCategory,
      startDate,
      endDate,
      numDays,
      reason,
    };

    try {
      // Send the data to the backend API for saving in MongoDB
      const response = await fetch("/api/leave-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leaveRequestData),
      });

      if (response.ok) {
        console.log("Leave request submitted successfully");
      } else {
        console.error("Failed to submit leave request");
      }
    } catch (error) {
      console.error("Error submitting leave request:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Leave Category Dropdown */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <label
            htmlFor="leave-category"
            className="text-sm font-medium text-gray-700 md:w-1/4"
          >
            Leave Category
          </label>
          <select
            id="leave-category"
            value={leaveCategory}
            onChange={handleCategoryChange}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full md:w-3/4"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Add New Category */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Add new category"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full md:w-3/4"
          />
          <button
            type="button"
            onClick={handleAddCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 focus:outline-none w-full md:w-auto"
          >
            Add Category
          </button>
        </div>

        {/* Start Date */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <label
            htmlFor="start-date"
            className="text-sm font-medium text-gray-700 md:w-1/4"
          >
            Start Date
          </label>
          <input
            type="date"
            id="start-date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full md:w-3/4"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <label
            htmlFor="end-date"
            className="text-sm font-medium text-gray-700 md:w-1/4"
          >
            End Date
          </label>
          <input
            type="date"
            id="end-date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full md:w-3/4"
          />
        </div>

        {/* Number of Days (calculated automatically) */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <label
            htmlFor="num-days"
            className="text-sm font-medium text-gray-700 md:w-1/4"
          >
            Number of Days
          </label>
          <input
            type="number"
            id="num-days"
            value={numDays}
            disabled
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full md:w-3/4 bg-gray-100"
          />
        </div>

        {/* Reason for Leave */}
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <label
            htmlFor="reason"
            className="text-sm font-medium text-gray-700 md:w-1/4"
          >
            Reason
          </label>
          <textarea
            id="reason"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason for leave"
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm w-full md:w-3/4"
          ></textarea>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full px-6 py-3 bg-green-600 text-white rounded-md shadow-md hover:bg-green-700 focus:outline-none"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
