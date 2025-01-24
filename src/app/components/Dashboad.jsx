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
import {
  Calendar,
  Eye,
  FileSpreadsheet,
  Layers,
  MousePointerClick,
} from "lucide-react";
import * as XLSX from "xlsx";

const Dashboard = () => {
  const [tractionData, setTractionData] = useState({
    data: [],
    totalImpression: 0,
  });
  const [botData, setBotData] = useState({ data: [], totalClicks: 0 });
  const [videoData, setVideoData] = useState({ data: [], totalClicks: 0 });
  const [meetingData, setMeetingData] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [filterType, setFilterType] = useState("1month");
  const [customDateRange, setCustomDateRange] = useState({
    start: "",
    end: "",
  });
  const [botFilterType, setBotFilterType] = useState("1month");
  const [botDateRange, setBotDateRange] = useState({
    startDate: "",
    endDate: "",
  });

  const [videoFilterType, setVideoFilterType] = useState("1month");
  const [videoDateRange, setVideoDateRange] = useState({
    startVideoDate: "",
    endVideoDate: "",
  });

  const [meetingFilterType, setMeetingFilterType] = useState("1month");
  const [meetingDateRange, setMeetingDateRange] = useState({
    startMeetingDate: "",
    endMeetingDate: "",
  });

  const filterData = () => {
    const now = new Date();
    let filteredData = tractionData.data;

    if (filterType === "1day") {
      const oneDayAgo = new Date(now.setDate(now.getDate() - 1));
      filteredData = filteredData.filter(
        (item) => new Date(item.createdAt) >= oneDayAgo
      );
    } else if (filterType === "1week") {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      filteredData = filteredData.filter(
        (item) => new Date(item.createdAt) >= oneWeekAgo
      );
    } else if (filterType === "1month") {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filteredData = filteredData.filter(
        (item) => new Date(item.createdAt) >= oneMonthAgo
      );
    } else if (filterType === "custom") {
      const startDate = new Date(customDateRange.start);
      const endDate = new Date(customDateRange.end);
      filteredData = filteredData.filter(
        (item) =>
          new Date(item.createdAt) >= startDate &&
          new Date(item.createdAt) <= endDate
      );
    }

    return filteredData;
  };

  const filteredData = filterData();

  const filterBotData = () => {
    const now = new Date();
    let filteredBotData = botData.data;

    if (botFilterType === "1day") {
      const oneDayAgo = new Date(now.setDate(now.getDate() - 1));
      filteredBotData = filteredBotData.filter(
        (item) => new Date(item.createdAt) >= oneDayAgo
      );
    } else if (botFilterType === "1week") {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      filteredBotData = filteredBotData.filter(
        (item) => new Date(item.createdAt) >= oneWeekAgo
      );
    } else if (botFilterType === "1month") {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filteredBotData = filteredBotData.filter(
        (item) => new Date(item.createdAt) >= oneMonthAgo
      );
    } else if (botFilterType === "custom") {
      const startDate = new Date(botDateRange.startDate);
      const endDate = new Date(botDateRange.endDate);
      filteredBotData = filteredBotData.filter(
        (item) =>
          new Date(item.createdAt) >= startDate &&
          new Date(item.createdAt) <= endDate
      );
    }

    return filteredBotData;
  };

  const filteredBotData = filterBotData();

  const filterVideoData = () => {
    const now = new Date();
    let filteredVideoData = videoData.data;

    if (videoFilterType === "1day") {
      const oneDayAgo = new Date(now.setDate(now.getDate() - 1));
      filteredVideoData = filteredVideoData.filter(
        (item) => new Date(item.createdAt) >= oneDayAgo
      );
    } else if (videoFilterType === "1week") {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      filteredVideoData = filteredVideoData.filter(
        (item) => new Date(item.createdAt) >= oneWeekAgo
      );
    } else if (videoFilterType === "1month") {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filteredVideoData = filteredVideoData.filter(
        (item) => new Date(item.createdAt) >= oneMonthAgo
      );
    } else if (videoFilterType === "custom") {
      const startDate = new Date(videoDateRange.startVideoDate);
      const endDate = new Date(videoDateRange.endVideoDate);
      filteredVideoData = filteredVideoData.filter(
        (item) =>
          new Date(item.createdAt) >= startDate &&
          new Date(item.createdAt) <= endDate
      );
    }

    return filteredVideoData;
  };

  const filteredVideoData = filterVideoData();

  const filterMeetingData = () => {
    const now = new Date();
    let filteredMeetingData = meetingData;

    if (meetingFilterType === "1day") {
      const oneDayAgo = new Date(now.setDate(now.getDate() - 1));
      filteredMeetingData = filteredMeetingData.filter(
        (item) => new Date(item.createdAt) >= oneDayAgo
      );
    } else if (meetingFilterType === "1week") {
      const oneWeekAgo = new Date(now.setDate(now.getDate() - 7));
      filteredMeetingData = filteredMeetingData.filter(
        (item) => new Date(item.createdAt) >= oneWeekAgo
      );
    } else if (meetingFilterType === "1month") {
      const oneMonthAgo = new Date(now.setMonth(now.getMonth() - 1));
      filteredMeetingData = filteredMeetingData.filter(
        (item) => new Date(item.createdAt) >= oneMonthAgo
      );
    } else if (meetingFilterType === "custom") {
      const startDate = new Date(meetingDateRange.startMeetingDate);
      const endDate = new Date(meetingDateRange.endMeetingDate);
      filteredMeetingData = filteredMeetingData.filter(
        (item) =>
          new Date(item.createdAt) >= startDate &&
          new Date(item.createdAt) <= endDate
      );
    }

    return filteredMeetingData;
  };

  const filteredMeetingData = filterMeetingData();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tractionRes, botRes, meetingRes, videoRes] = await Promise.all([
        axios.get(`${baseURL}/api/traction/get-traction`),
        axios.get(`${baseURL}/api/traction/get-bot-imperssion`),
        axios.get(`${baseURL}/api/users/getMeeting`),
        axios.get(`${baseURL}/api/traction/get-video-imperssion`),
      ]);
      setTractionData(tractionRes.data);
      setBotData(botRes.data);
      setMeetingData(meetingRes.data.data);
      setVideoData(videoRes.data);
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

  function exportpageImpressionsToExcel(data) {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        Page: item.page,
        Impressions: item.impression,
        "Created At": formatDate(item.createdAt),
        "Last Updated": formatDate(item.updatedAt),
      }))
    );
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Page Impressions");
    XLSX.writeFile(workbook, "Page_Impressions_Details.xlsx");
  }

  function exportToExcelBotInteractions(data) {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        "Bot Name": item.bot,
        Clicks: item.clicks,
        "Created At": formatDate(item.createdAt),
        "Last Updated": formatDate(item.updatedAt),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bot Interactions");

    XLSX.writeFile(workbook, "Bot_Interactions_Details.xlsx");
  }

  function exportToExcelVideoInteractions(data) {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((item) => ({
        "Video Name/URL": item.video,
        Clicks: item.views,
        "Created At": formatDate(item.createdAt),
        "Last Updated": formatDate(item.updatedAt),
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Video Interactions");

    XLSX.writeFile(workbook, "Video_Interactions_Details.xlsx");
  }

  function exportToExcelMeetings(data) {
    const worksheet = XLSX.utils.json_to_sheet(
      data.map((meeting) => ({
        Customer: meeting.customerName,
        Company: meeting.companyName,
        Contact: `${meeting.email}, ${meeting.phoneNumber}`,
        Description: meeting.desc,
        Status: meeting.attended ? "Completed" : "Pending",
      }))
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Meetings");

    XLSX.writeFile(workbook, "Meetings_Details.xlsx");
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-900 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Total Impressions</h3>
              <Eye className="text-indigo-400" />
            </div>
            <div className="text-3xl font-bold">
              {tractionData.totalImpression}
            </div>
            <p className="text-indigo-300 mt-2">Total Page Views</p>
          </div>

          <div className="bg-purple-900 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Total Bot Clicks</h3>
              <MousePointerClick className="text-purple-400" />
            </div>
            <div className="text-3xl font-bold">{botData.totalClicks}</div>
            <p className="text-purple-300 mt-2">Total Bot Interactions</p>
          </div>

          <div className="bg-blue-900 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Meetings Overview</h3>
              <Calendar className="text-blue-400" />
            </div>
            <div className="text-3xl font-bold">{meetingStats.total}</div>
            <div className="mt-2 space-y-1">
              <p className="text-green-300">
                Completed: {meetingStats.completed}
              </p>
              <p className="text-yellow-300">Pending: {meetingStats.pending}</p>
            </div>
          </div>

          <div className="bg-purple-900 rounded-lg p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Total Video Views</h3>
              <Eye className="text-indigo-400" />
            </div>
            <div className="text-3xl font-bold">{videoData.totalClicks}</div>
            <p className="text-purple-300 mt-2">Total Bot Interactions</p>
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
                  { name: "Total Video Views", value: videoData.totalClicks },
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">
              Page Impressions Details
            </h2>
            <div className="flex gap-4">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                <option value="1day">Last 1 Day</option>
                <option value="1week">Last 1 Week</option>
                <option value="1month">Last 1 Month</option>
                <option value="custom">Custom Range</option>
              </select>
              {filterType === "custom" && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={customDateRange.start}
                    onChange={(e) =>
                      setCustomDateRange({
                        ...customDateRange,
                        start: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                  />
                  <input
                    type="date"
                    value={customDateRange.end}
                    onChange={(e) =>
                      setCustomDateRange({
                        ...customDateRange,
                        end: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => exportpageImpressionsToExcel(filteredData)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex justify-between items-center gap-2"
            >
              Export <Layers />
            </button>
          </div>
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
                {filteredData.map((item) => (
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Bot Interactions Details
            </h2>
            <div className="flex gap-4">
              <select
                value={botFilterType}
                onChange={(e) => setBotFilterType(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                <option value="1day">Last 1 Day</option>
                <option value="1week">Last 1 Week</option>
                <option value="1month">Last 1 Month</option>
                <option value="custom">Custom Range</option>
              </select>
              {botFilterType === "custom" && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={botDateRange.startDate}
                    onChange={(e) =>
                      setBotDateRange({
                        ...botDateRange,
                        startDate: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                  />
                  <input
                    type="date"
                    value={botDateRange.endDate}
                    onChange={(e) =>
                      setBotDateRange({
                        ...botDateRange,
                        endDate: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => exportToExcelBotInteractions(filteredBotData)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex justify-between items-center gap-2"
            >
              Export <Layers />
            </button>
          </div>

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
                {filteredBotData.map((item) => (
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

        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              Video Interactions Details
            </h2>
            <div className="flex gap-4">
              <select
                value={videoFilterType}
                onChange={(e) => setVideoFilterType(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                <option value="1day">Last 1 Day</option>
                <option value="1week">Last 1 Week</option>
                <option value="1month">Last 1 Month</option>
                <option value="custom">Custom Range</option>
              </select>
              {videoFilterType === "custom" && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={videoDateRange.startVideoDate}
                    onChange={(e) =>
                      setVideoDateRange({
                        ...videoDateRange,
                        startVideoDate: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                  />
                  <input
                    type="date"
                    value={videoDateRange.endVideoDate}
                    onChange={(e) =>
                      setVideoDateRange({
                        ...videoDateRange,
                        endVideoDate: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => exportToExcelVideoInteractions(filteredVideoData)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex justify-between items-center gap-2"
            >
              Export <Layers />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4 text-gray-300">
                    Video Name/URL
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
                {filteredVideoData.map((item) => (
                  <tr key={item._id} className="border-b border-gray-700">
                    <td className="py-3 px-4 text-white">
                      {item.video.includes("youtube.com") ||
                      item.video.includes("youtu.be") ? (
                        <div className="w-64 h-36">
                          <iframe
                            className="w-full h-full"
                            src={
                              item.video.includes("youtube.com")
                                ? item.video.replace("watch?v=", "embed/")
                                : item.video.replace(
                                    "youtu.be/",
                                    "youtube.com/embed/"
                                  )
                            }
                            title="YouTube video"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : (
                        item.video
                      )}
                    </td>

                    <td className="py-3 px-4 text-gray-300">{item.views}</td>
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white mb-4">
              All Meetings
            </h2>
            <div className="flex gap-4">
              <select
                value={meetingFilterType}
                onChange={(e) => setMeetingFilterType(e.target.value)}
                className="bg-gray-700 text-white px-4 py-2 rounded"
              >
                <option value="1day">Last 1 Day</option>
                <option value="1week">Last 1 Week</option>
                <option value="1month">Last 1 Month</option>
                <option value="custom">Custom Range</option>
              </select>
              {meetingFilterType === "custom" && (
                <div className="flex gap-2">
                  <input
                    type="date"
                    value={meetingDateRange.startMeetingDate}
                    onChange={(e) =>
                      setMeetingDateRange({
                        ...meetingDateRange,
                        startMeetingDate: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                  />
                  <input
                    type="date"
                    value={meetingDateRange.endMeetingDate}
                    onChange={(e) =>
                      setMeetingDateRange({
                        ...meetingDateRange,
                        endMeetingDate: e.target.value,
                      })
                    }
                    className="bg-gray-700 text-white px-4 py-2 rounded"
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => exportToExcelMeetings(filteredMeetingData)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded flex justify-between items-center gap-2"
            >
              Export <Layers />
            </button>
          </div>

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
                {filteredMeetingData.map((meeting) => (
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
