import React, { useEffect, useState } from "react";
import axios from "../api/axios";

const ShowDashboardUserData = () => {
  // States for user details and edit/update functionality
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [updatedDetails, setUpdatedDetails] = useState({ ...userDetails });
  const [editing, setEditing] = useState(false);
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

  // Handle input changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({
      ...updatedDetails,
      [name]: value,
    });
  };

  // Handle updating user details
  const handleUpdateDetails = async () => {
    try {
      const response = await axios.patch("/students/editStudent", updatedDetails);
      setUserDetails((prev) => ({ ...prev, ...updatedDetails }));
      setEditing(false);
      console.log("Details updated successfully:", response.data);
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  // Toggle edit mode
  const toggleEditing = () => {
    setEditing(!editing);
  };

  // Fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 shadow-xl rounded-2xl">
      <h3 className="text-2xl font-bold text-gray-800 mb-6">User Details</h3>
      {editing ? (
        <div>
          {/* Edit Form */}
          {Object.keys(updatedDetails).map(
            (key) =>
              key !== "role" &&
              key !== "phone" && (
                <div className="mb-5" key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={key}
                    value={updatedDetails[key]}
                    onChange={handleEditChange}
                    className="p-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              )
          )}
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg mt-4"
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
                <p className="text-gray-700 mb-4" key={key}>
                  <span className="font-semibold text-gray-800">
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </span>{" "}
                  {userDetails[key]}
                </p>
              )
          )}
          <button
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-6 rounded-lg mt-4"
            onClick={toggleEditing}
          >
            Edit Details
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowDashboardUserData;
