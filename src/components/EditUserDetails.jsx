import React from "react";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const EditUserDetails = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
  });
  

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({
      ...updatedDetails,
      [name]: value,
    });
  };

  const [editing, setEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({ ...userDetails });
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
  const toggleEditing = () => {
    setEditing(!editing);
    setFormShow(false);
    setResultShow(false);
  };

  const toggleFormShow = () => {
    setFormShow(!formShow);
    setEditing(false);
    setResultShow(false);
  };
  const toggleResult = () => {
    setResultShow(!resultShow);
    setEditing(false);
    setFormShow(false);
  };
  const [loading, setLoading] = useState(true);


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
  }, []);
    if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
       

      <div className="bg-white p-6 shadow-lg rounded-2xl col-span-10">
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
            <button className="bg-indigo-500 text-white py-2 px-4 rounded" onClick={toggleEditing}>Edit Details</button>
          </div>
        )}
      </div>
  );
};

export default EditUserDetails;
