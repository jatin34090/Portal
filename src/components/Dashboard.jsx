// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import FormDetailPage from "./FormDetailPage";
import ResultPage from "./ResultPage";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import ShowDashboardUserData from "./ShowDashboardUserData";

const Dashboard = () => {
  // State to store user details and statuses

  // Fetch user details from API

  return (
    <div className="h-screen grid grid-cols-12 bg-gray-50">
      {/* Left Sidebar */}
      <div className="col-span-2 h-screen bg-gray-900 shadow-lg">
        <DashboardSidebar />
      </div>

      {/* Main Content Area */}
      <div className="col-span-10 p-8 bg-white rounded-xl shadow-xl overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-700 mb-6">User Dashboard</h1>

        {/* Payment and Admit Card Status */}
        <div className="mb-8">
          <DashboardHeader />
        </div>

        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          <ShowDashboardUserData />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
