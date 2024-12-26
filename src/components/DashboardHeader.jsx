import React from 'react'
import { useState, useEffect } from 'react';
import axios from '../api/axios';

const DashboardHeader = () => {
      const [paymentStatus, setPaymentStatus] = useState("Pending");
      const [admitCardStatus, setAdmitCardStatus] = useState("Pending");
      
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
    
//   useEffect(() => {
//     paymentStatusHandler();
//     admitCardStatusHandler();
//   }, []);


  return (
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
  )
}

export default DashboardHeader