import { useNavigate, useParams } from "react-router-dom";
import tickCircle from "../assets/tickCircle.png";
import { useEffect, useState } from "react";
import axios from "../api/axios";

const PaymentSuccessMessage = () => {
  const { payment_id } = useParams();
  const navigate = useNavigate();
  const [admitCardStatus, setAdmitCardStatus] = useState("Pending");

  const generateAdmitCard = async () => {
    try {
      const response = await axios.post("/payment/generateAdmitCard");
      console.log("response from generateAdmitCard", response);
      setAdmitCardStatus("Generated");
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    generateAdmitCard();

    const addPaymentId = async () => {
      try {
        const response = await axios.patch("/students/editStudent", {
          payment_id,
        });
        console.log("response from payment_id", response);
      } catch (error) {
        console.log("error", error);
      }
    };

    addPaymentId();
  }, []);
  useEffect(() => {
    if (admitCardStatus === "Generated") {
      navigate("/dashboard");
    }
  }, [admitCardStatus]);
  return (
    <div className="flex justify-center h-screen items-center ">
      <div className="flex flex-col justify-center items-center shadow-lg p-6 rounded-lg">
        <img src={tickCircle} alt="" />
        <div className="text-2xl p-10">
          {` Your Payment is Successfull. Order ID : ${payment_id}`}
        </div>
        <span>Thank you for your payment.</span>
      </div>
    </div>
  );
};
export default PaymentSuccessMessage;
