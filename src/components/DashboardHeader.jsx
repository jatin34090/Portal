import React from "react";
import { useState, useEffect } from "react";
import axios from "../api/axios";

const DashboardHeader = () => {
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [admitCardStatus, setAdmitCardStatus] = useState("Pending");

  const paymentStatusHandler = async () => {
    try {
      const response = await axios.get("/form/payment/getForm");
      console.log("Response2 of paymentStatusHandler", response);
      if (response.data.length != 0) {
        setPaymentStatus(`hi ${response.data.paymentStatus}`);
      }
    } catch (error) {
      console.error("Error fetching payment status:", error);
    }
  };

  const admitCardStatusHandler = async () => {
    try {
      const response = await axios.get("/students/getAdmitCard");
      console.log("response of admitCardStatusHandler", response);
      if(response.data.admitCard){
      setAdmitCardStatus(response.data.admitCard);
      }
    } catch (error) {
      console.error("error fetching admit card status", error);
    }
  };

  useEffect(() => {
    paymentStatusHandler();
    admitCardStatusHandler();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-8 mb-6">
      <div className="bg-white p-4 rounded-2xl shadow-lg">
        <h3 className="text-lg font-medium ">Payment Status</h3>
        <p className="text-gray-600">{paymentStatus}</p>
      </div>
      <div className="bg-white px-4 rounded-2xl shadow-lg">
        <h3 className="text-lg font-medium m-3">Admit Card</h3>
        {admitCardStatus === "Pending" ? (
          <p className="text-gray-600 px-4">{admitCardStatus}</p>
        ) : (
          <a
            href={admitCardStatus} // Link to the PDF
            download="AdmitCard.pdf" // Suggest a default filename
            target="_blank" // Open in a new tab
            rel="noopener noreferrer" // Security best practice
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded m-3"
          >
            Download Your Admit Card
          </a>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;