// src/pages/Dashboard.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import FormDetailPage from "./FormDetailPage";

const Dashboard = () => {
  const navigate = useNavigate();
  const [formShow, setFormShow] = useState(false);

  // State to store user details and statuses
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [admitCardStatus, setAdmitCardStatus] = useState("Pending");
  const [editing, setEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({ ...userDetails });
  const [loading, setLoading] = useState(true);

  // Fetch user details from API
  const fetchUserDetails = async () => {
    try {
      const response = await axios.get("/students/getStudentsById");
      setUserDetails(response.data);
      setUpdatedDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    // paymentStatusHandler();
    // admitCardStatusHandler();
  }, []);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({
      ...updatedDetails,
      [name]: value,
    });
  };

  const handleUpdateDetails = async () => {
    try {
      const response = await axios.patch(
        "/students/editStudent",
        updatedDetails
      );
      setUserDetails((prev) => ({ ...prev, ...updatedDetails }));
      setEditing(false);
      console.log("Details updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  const paymentStatusHandler = async () => {
    try {
      const response = await axios.get("/form/payment/getForm");
      setPaymentStatus(`hi ${response.data.paymentStatus}`);
    } catch (error) {
      console.error("Error fetching payment status:", error);
    }
  };

  const admitCardStatusHandler = async () => {
    try {
      const response = await axios.get("/students/getAdmitCard");
      console.log("response of admitCardStatusHandler", response);
      setAdmitCardStatus(response.data.admitCardStatus);
    } catch (error) {
      console.error("error fetching admit card status", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Perform logout actions (e.g., clear tokens, reset state)
    navigate("/");
  };

  const toggleEditing = () => {
    setEditing(!editing);
    setFormShow(false);
  };

  const toggleFormShow = () => {
    setFormShow(!formShow);
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen ">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6 ">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <ul>
          <li>
            <button
              className="text-gray-200 hover:text-indigo-400 "
              onClick={() => setEditing(false)}
            >
              View User Details
            </button>
          </li>
          <li className="mt-2">
            <button
              className="text-gray-200 hover:text-indigo-400"
              onClick={toggleEditing}
            >
              Edit User Details
            </button>
          </li>
          <li className="mt-2">
            <button
              className="text-gray-200 hover:text-indigo-400"
              onClick={toggleFormShow}
            >
              Edit Form Details
            </button>
          </li>
          <li className="mt-6">
            <button
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-4">User Dashboard</h1>

        {/* Payment and Admit Card Status */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="text-lg font-medium ">Payment Status</h3>
            <p className="text-gray-600">{paymentStatus}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-lg">
            <h3 className="text-lg font-medium">Admit Card Status</h3>
            <p className="text-gray-600">{admitCardStatus}</p>
          </div>
        </div>

        {/* User Details */}
        <div className="bg-white p-6 shadow-lg rounded-2xl">
          <h3 className="text-xl font-semibold mb-4">User Details</h3>
          {editing ? (
            <div>
              {/* Edit Form */}
              {Object.keys(updatedDetails).map(
                (key) =>
                  key !== "role" &&
                  key !== "phone" && (
                    <div className="mb-4" key={key}>
                      <label className="block text-sm font-medium text-gray-700">
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={updatedDetails[key]}
                        onChange={handleEditChange}
                        className="mt-1 p-2 w-full border border-gray-300 rounded"
                      />
                    </div>
                  )
              )}
              <button
                className="bg-indigo-500 text-white py-2 px-4 rounded"
                onClick={handleUpdateDetails}
              >
                Update Details
              </button>
            </div>
          ) : (
            <div>
              {/* View Mode */}
              {Object.keys(userDetails).map(
                (key) =>
                  key !== "paymentStatus" &&
                  key !== "admitCardStatus" && (
                    <p className="text-gray-700" key={key}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}:{" "}
                      {userDetails[key]}
                    </p>
                  )
              )}
            </div>
          )}
        </div>

        {formShow && (
          <div className="bg-white p-6 m-6 rounded-2xl shadow-lg">
            <FormDetailPage />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
