"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { baseURL } from "../baseUrl";

const Dashboard = () => {
  const [tractionData, setTractionData] = useState({
    data: [],
    totalImpression: 0,
  });
  const [botData, setBotData] = useState({ data: [], totalClicks: 0 });
  const [meetingData, setMeetingData] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tractionRes, botRes, meetingRes] = await Promise.all([
        axios.get(`${baseURL}/api/traction/get-traction`),
        axios.get(`${baseURL}/api/traction/get-bot-imperssion`),
        axios.get(`${baseURL}/api/users/getMeeting`),
      ]);
      setTractionData(tractionRes.data);
      setBotData(botRes.data);
      setMeetingData(meetingRes.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getMeetingStats = () => {
    const total = meetingData.length;
    const completed = meetingData.filter((m) => m.attended).length;
    const pending = total - completed;
    return { total, completed, pending };
  };

  const handleMarkAttended = async (meeting) => {
    setSelectedMeeting(meeting);
    setShowConfirmation(true);
  };

  const confirmMarkAttended = async () => {
    if (!selectedMeeting) return;

    setIsUpdating(true);
    try {
      await axios.put(
        `${baseURL}/api/users/editMeeting?id=${selectedMeeting._id}`,
        {
          attended: true,
        }
      );
      await fetchData();
      setShowConfirmation(false);
      setSelectedMeeting(null);
    } catch (error) {
      console.error("Error updating meeting:", error);
      alert("Failed to update meeting status");
    } finally {
      setIsUpdating(false);
    }
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

  const meetingStats = getMeetingStats();

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-indigo-900 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Total Impressions</h3>
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
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold">
              {tractionData.totalImpression}
            </div>
            <p className="text-indigo-300 mt-2">Total Page Views</p>
          </div>

          <div className="bg-purple-900 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Total Bot Clicks</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-purple-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold">{botData.totalClicks}</div>
            <p className="text-purple-300 mt-2">Total Bot Interactions</p>
          </div>

          <div className="bg-blue-900 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Meetings Overview</h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="text-3xl font-bold">{meetingStats.total}</div>
            <div className="mt-2 space-y-1">
              <p className="text-green-300">
                Completed: {meetingStats.completed}
              </p>
              <p className="text-yellow-300">Pending: {meetingStats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Metrics Overview
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={[
                  {
                    name: "Total Impressions",
                    value: tractionData.totalImpression,
                  },
                  { name: "Total Bot Clicks", value: botData.totalClicks },
                  { name: "Total Meetings", value: meetingStats.total },
                  { name: "Completed Meetings", value: meetingStats.completed },
                  { name: "Pending Meetings", value: meetingStats.pending },
                ]}
              >
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none" }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="value" fill="#818cf8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Page Impressions Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">Page</th>
                  <th className="text-left py-3 px-4 text-gray-300">
                    Impressions
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300">
                    Created At
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {tractionData.data.map((item) => (
                  <tr key={item._id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-white">{item.page}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {item.impression}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {formatDate(item.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            Bot Interactions Details
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">
                    Bot Name
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300">Clicks</th>
                  <th className="text-left py-3 px-4 text-gray-300">
                    Created At
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300">
                    Last Updated
                  </th>
                </tr>
              </thead>
              <tbody>
                {botData.data.map((item) => (
                  <tr key={item._id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-white">{item.bot}</td>
                    <td className="py-3 px-4 text-gray-300">{item.clicks}</td>
                    <td className="py-3 px-4 text-gray-300">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {formatDate(item.updatedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            All Meetings
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">
                    Customer
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300">Company</th>
                  <th className="text-left py-3 px-4 text-gray-300">Contact</th>
                  <th className="text-left py-3 px-4 text-gray-300">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 text-gray-300">Status</th>
                  <th className="text-left py-3 px-4 text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody>
                {meetingData.map((meeting) => (
                  <tr key={meeting._id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-white">
                      {meeting.customerName}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      {meeting.companyName}
                    </td>
                    <td className="py-3 px-4 text-gray-300">
                      <div>{meeting.email}</div>
                      <div>{meeting.phoneNumber}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-300">{meeting.desc}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm ${
                          meeting.attended
                            ? "bg-green-900 text-green-300"
                            : "bg-yellow-900 text-yellow-300"
                        }`}
                      >
                        {meeting.attended ? "Completed" : "Pending"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {!meeting.attended && (
                        <button
                          onClick={() => handleMarkAttended(meeting)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm"
                        >
                          Mark Attended
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {showConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Confirm Meeting Attendance
              </h3>
              <p className="text-gray-300 mb-6">
                Are you sure you want to mark the meeting with{" "}
                {selectedMeeting?.customerName} as attended?
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
                  disabled={isUpdating}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMarkAttended}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
