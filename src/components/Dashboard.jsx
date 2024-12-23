// src/pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
// import { useAuth } from '../../context/AuthContext';  // Assuming you're using AuthContext


const Dashboard = () => {
  // const { isAuthenticated, userRole } = useAuth();  // Get authentication and role status
  const navigate = useNavigate();

  // Simulate user details and status data (this would come from an API in a real app)
  const [paymentStatus, setPaymentStatus] = useState('Pending'); // Example status
  const [admitCardStatus, setAdmitCardStatus] = useState('Not Issued');
  const [userDetails, setUserDetails] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '123-456-7890',
  });
  const [editing, setEditing] = useState(false);
  const [updatedDetails, setUpdatedDetails] = useState({ ...userDetails });

  const fetchBasicDetails = async () =>{
    try{
      const response = await axios.get("/students/getStudentsById");
        console.log(response);
      
    }catch(error){
      console.error("Error fetching form data:", error);
    }
  }



  useEffect(()=>{
    fetchBasicDetails();
  })
  // useEffect(() => {
  //   if (!isAuthenticated) {
  //     navigate('/login'); // Redirect to login page if not authenticated
  //   }
  //   // Fetch user data and payment/admit card status from the backend here
  // }, [isAuthenticated, navigate]);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setUpdatedDetails({
      ...updatedDetails,
      [name]: value,
    });
  };

  const handleUpdateDetails = () => {
    // Update user details with API call here
    setUserDetails({ ...updatedDetails });
    setEditing(false);
  };

  const toggleEditing = () => {
    setEditing(!editing);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar */}
      <div className="w-64 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
        <ul>
          <li>
            <button
              className="text-gray-200 hover:text-indigo-400"
              onClick={() => setEditing(false)} // Close edit form when clicking view details
            >
              View User Details
            </button>
          </li>
          <li className="mt-2">
            <button
              className="text-gray-200 hover:text-indigo-400"
              onClick={toggleEditing} // Toggle between edit and view modes
            >
              Edit User Details
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-4">User Dashboard</h1>

        {/* Payment and Admit Card Status */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-medium">Payment Status</h3>
            <p className="text-gray-600">{paymentStatus}</p>
          </div>
          <div className="bg-white p-4 rounded shadow-lg">
            <h3 className="text-lg font-medium">Admit Card Status</h3>
            <p className="text-gray-600">{admitCardStatus}</p>
          </div>
        </div>

        {/* User Details */}
        <div className="bg-white p-6 rounded shadow-lg">
          <h3 className="text-xl font-semibold mb-4">User Details</h3>
          {editing ? (
            <div>
              {/* Edit Form */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={updatedDetails.name}
                  onChange={handleEditChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={updatedDetails.email}
                  onChange={handleEditChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={updatedDetails.phone}
                  onChange={handleEditChange}
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
              </div>
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
              <p className="text-gray-700">Name: {userDetails.name}</p>
              <p className="text-gray-700">Email: {userDetails.email}</p>
              <p className="text-gray-700">Phone: {userDetails.phone}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

