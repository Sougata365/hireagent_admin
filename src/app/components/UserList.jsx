"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Layers, Search } from "lucide-react";
import { baseURL } from "../baseUrl";
import * as XLSX from "xlsx";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [limit] = useState(10);
  const [dateFilter, setDateFilter] = useState("all");
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, dateFilter, customDateRange]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/users/getAllUsers`, {
        params: {
          page: currentPage,
          limit,
          search: searchTerm,
          dateFilter: dateFilter,
          startDate: customDateRange.start,
          endDate: customDateRange.end,
        },
      });

      setUsers(response.data.users);
      setTotalUsers(response.data.totalUsers);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
    setCurrentPage(1);
  };

  const handleCustomDateChange = (e) => {
    const { name, value } = e.target;
    setCustomDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  function exportToExcelUsers(users) {
    // Create a worksheet from the user data
    const worksheet = XLSX.utils.json_to_sheet(
      users.map((user) => ({
        Name: user?.name,
        Email: user?.email,
        Phone: user?.phoneNumber || "N/A",
        Status: user?.status ? "Active" : "Inactive",
        Plan: user?.selectedPlan?.name || "N/A",
        JoinedDate: formatDate(user?.createdAt),
      }))
    );

    // Create a workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

    // Trigger the download
    XLSX.writeFile(workbook, "User_Management_Details.xlsx");
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">User Management</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-900 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Total Users</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-indigo-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold">{totalUsers}</div>
            <p className="text-indigo-300 mt-2">Registered Users</p>
          </div>

          <div className="bg-green-900 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Active Users</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold">
              {users.filter((user) => user?.status).length}
            </div>
            <p className="text-green-300 mt-2">Currently Active</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full bg-gray-700 text-white px-4 py-2 pl-10 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleDateFilterChange("all")}
            className={`px-4 py-2 rounded ${
              dateFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleDateFilterChange("1day")}
            className={`px-4 py-2 rounded ${
              dateFilter === "1day"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            Last 1 Day
          </button>
          <button
            onClick={() => handleDateFilterChange("1week")}
            className={`px-4 py-2 rounded ${
              dateFilter === "1week"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            Last 1 Week
          </button>
          <button
            onClick={() => handleDateFilterChange("1month")}
            className={`px-4 py-2 rounded ${
              dateFilter === "1month"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-white"
            }`}
          >
            Last 1 Month
          </button>
          <div>
            <label className="text-white mr-2">Custom Range:</label>
            <input
              type="date"
              name="start"
              value={customDateRange.start}
              onChange={handleCustomDateChange}
              className="bg-gray-700 text-white px-2 py-1 rounded"
            />
            <input
              type="date"
              name="end"
              value={customDateRange.end}
              onChange={handleCustomDateChange}
              className="bg-gray-700 text-white px-2 py-1 rounded ml-2"
            />
            <button
              onClick={() => handleDateFilterChange("custom")}
              className="ml-2 px-4 py-2 bg-blue-600 text-white rounded"
            >
              Apply
            </button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-white mb-4">User List</h2>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => exportToExcelUsers(users)}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex justify-between items-center gap-2"
              >
                Export <Layers />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Name</th>
                  <th className="text-left py-3 px-4 text-gray-300">Email</th>
                  <th className="text-left py-3 px-4 text-gray-300">Phone</th>
                  <th className="text-left py-3 px-4 text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300">Plan</th>
                  <th className="text-left py-3 px-4 text-gray-300">
                    Joined Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user?._id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-white">{user?.name}</td>
                    <td className="py-3 px-4 text-gray-300">{user?.email}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {user?.phoneNumber || "N/A"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          user?.status
                            ? "bg-green-900 text-green-300"
                            : "bg-red-900 text-red-300"
                        }`}
                      >
                        {user?.status ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {user?.selectedPlan?.name || "N/A"}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {formatDate(user?.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-gray-400">
              Showing {(currentPage - 1) * limit + 1} to{" "}
              {Math.min(currentPage * limit, totalUsers)} of {totalUsers} users
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Previous
              </button>
              <div className="flex space-x-2">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index + 1}
                    onClick={() => handlePageChange(index + 1)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === index + 1
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white hover:bg-gray-600"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage === totalPages
                    ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
