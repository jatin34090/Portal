import { useDispatch, useSelector } from "react-redux";
import axios from "../api/axios";
import Sidebar from "./Sidebar";
import { useEffect, useState } from "react";
import { fetchEducationalDetails } from "../redux/slices/educationalDetailsSlice";
import { fetchFamilyDetails } from "../redux/slices/familyDetailsSlice";
import { fetchBasicDetails } from "../redux/slices/basicDetailsSlice";
import { fetchBatchDetails } from "../redux/slices/batchDetailsSlice";
import AllFormNotAvailable from "./AllFormNotAvailable";

const payment = () => {
  const dispatch = useDispatch();

  const [allFormNotAvailable, setAllFormNotAvailable] = useState(false);

  const { dataExist: basicDetailsDataExist } = useSelector(
    (state) => state.basicDetails
  );
  const { dataExist: batchDetailsDataExist } = useSelector(
    (state) => state.batchDetails
  );
  const { dataExist: educationalDetailsDataExist } = useSelector(
    (state) => state.educationalDetails
  );
  const { dataExist: familyDetailsDataExist } = useSelector(
    (state) => state.familyDetails
  );

  useEffect(() => {
    dispatch(fetchBasicDetails());
    dispatch(fetchBatchDetails());
    dispatch(fetchEducationalDetails());
    dispatch(fetchFamilyDetails());
  }, [dispatch]);

  const checkoutHandler = async () => {
    if (
      !basicDetailsDataExist ||
      !batchDetailsDataExist ||
      !educationalDetailsDataExist ||
      !familyDetailsDataExist
    ) {
      setAllFormNotAvailable(true);
      // alert("Please fill all the details first");
      return;

    }
    const {
      data: { key },
    } = await axios.get("/payment/getKey");
    console.log("key", key);

    const response = await axios.post("/payment/checkout");
    console.log("response", response);
    console.log("response.data.order.amount", response.data.order.amount);
    console.log("response.data.order.currency", response.data.order.currency);
    console.log("response.data.currency", response.data.currency);


    const options = {
      key,
      amount: response.data.order.amount,
      currency: response.data.order.currency,
      name: "Acme Corp",
      description: "Test Payment",
      order_id: response.data.order.id,
      callback_url: "http://localhost:5000/api/payment/paymentverification",
      prefill: {
        name: "jatin gupta",
        email: "5Yt0d@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#c61d23",
      },
      handler: async function (response) {
        console.log("Payment successful", response);

        // Optionally, verify the payment on your backend

        // Redirect to the success page
        window.location.href = `${import.meta.env.VITE_APP_API_URL}/payment/success/${response.razorpay_order_id}`;
      },
    };

    console.log("options", options);

    const razorpay = new window.Razorpay(options);

    razorpay.open();

    console.log("razorpay object", razorpay);
    // await axios("/payment/paymentverification", {});
  };

  return (
    <div className="grid grid-cols-7 h-screen">
      <div className="col-span-1">
        <Sidebar />
      </div>

      <div className="col-span-6 flex items-center justify-center">
        <div
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={checkoutHandler}
        >
          payment
        </div>
      {allFormNotAvailable && <AllFormNotAvailable setAllFormNotAvailable={setAllFormNotAvailable} familyDetailsDataExist={familyDetailsDataExist} educationalDetailsDataExist={educationalDetailsDataExist} batchDetailsDataExist={batchDetailsDataExist} basicDetailsDataExist={basicDetailsDataExist}/>}
      </div>
    </div>
  );
};
export default payment;
