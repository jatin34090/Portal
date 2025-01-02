import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { data, useLocation, useNavigate } from "react-router-dom";
import useRazorpay from "react-razorpay";
import checkoutHandler from "../../utils/Razorpay";

const EducationalDetailsForm = () => {
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    LastSchoolName: "",
    Class: "",
    Percentage: "",
    YearOfPassing: "",
    Board: "",
  });

  const location = useLocation();
  const pathLocation = location.pathname;

  const [checkUrl, setCheckUrl] = useState("");

  const [dataExist, setDataExist] = useState(false);

  const [boards, setBoards] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch boards and form data in one go
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boardsResponse, formDataResponse] = await Promise.all([
          axios.get("/board"),
          axios.get("/form/educationalDetails/getForm"),
        ]);

        console.log("formDataResponse", formDataResponse.data);
        if (formDataResponse.data.length != 0) {
          setDataExist(true);
        }
        setBoards(boardsResponse.data);

        if (formDataResponse.data[0]) {
          const { LastSchoolName, Percentage, Class, YearOfPassing, Board } =
            formDataResponse.data[0];
          setFormData({
            LastSchoolName,
            Class,
            Percentage,
            YearOfPassing,
            Board,
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    const checkPaymentStatus = async () => {
      const response = await axios.get("/students/getStudentsById");

      setPaymentStatus(() => (response.data.paymentId ? "Paid" : "Pending"));
      console.log("response form educationalPage", response);
    };
    checkPaymentStatus();

    fetchData();
    setCheckUrl(pathLocation === "/educationalDetailsForm");
  }, []);
  // const checkoutHandler = async () => {
  //   const {
  //     data: { key },
  //   } = await axios.get("/payment/getKey");
  //   console.log("key", key);

  //   const response = await axios.post("/payment/checkout");
  //   console.log("response", response);
  //   console.log("response.data.order.amount", response.data.order.amount);
  //   console.log("response.data.order.currency", response.data.order.currency);
  //   console.log("response.data.currency", response.data.currency);

  //   const options = {
  //     key,
  //     amount: response.data.order.amount,
  //     currency: response.data.order.currency,
  //     name: "Acme Corp",
  //     description: "Test Payment",
  //     order_id: response.data.order.id,
  //     callback_url: "http://localhost:5000/api/payment/paymentverification",
  //     prefill: {
  //       name: "jatin gupta",
  //       email: "5Yt0d@example.com",
  //       contact: "9999999999",
  //     },
  //     theme: {
  //       color: "#c61d23",
  //     },
  //     handler: async function (response) {
  //       console.log("Payment successful", response);

  //       // Optionally, verify the payment on your backend
        
  //         // Redirect to the success page
  //         window.location.href = `http://localhost:5173/payment/success/${response.razorpay_order_id}`;
       
  //     },
  //   };

  //   const razorpay = new window.Razorpay(options);
  //   razorpay.open();

  //   console.log("razorpay", razorpay);
  //   // await axios("/payment/paymentverification", {});
  // };
  // Handle input changes and error checking
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };

      // Error handling for Class and TotalMarks
      if (name === "Class" && (value < 6 || value > 12)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Class: "Class must be between 6 and 12",
        }));
      } else if (name === "Percentage" && (value < 0 || value > 100)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          Percentage: "Percentage must be between 0 and 100",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }

      return updatedFormData;
    });
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const apiUrl = dataExist
          ? "/form/educationalDetails/updateForm"
          : "/form/educationalDetails/addForm";
        const method = dataExist ? axios.patch : axios.post;
        await method(apiUrl, formData);
        setSubmitMessage("Form submitted successfully!");
        if (checkUrl) {
          console.log("GO on the dashboard page");
          if (paymentStatus === "Paid") {
            navigate("/dashboard");
          } else {
            await checkoutHandler();
          }
        }
      } catch (error) {
        setSubmitMessage(error.response);
        console.error("Error submitting form", error);
      }
    }
  };

  // Convert class number to Roman numeral
  const convertToRoman = (num) => {
    const romanNumerals = {
      6: "VI",
      7: "VII",
      8: "VIII",
      9: "IX",
      10: "X",
      11: "XI",
      12: "XII",
    };
    return romanNumerals[num];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`${
        pathLocation === "/educationalDetailsForm" && "min-h-screen"
      } flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50`}
    >
      <form
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-6"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Educational Details Form
        </h1>

        {Object.keys(formData).map((key) => (
          <div className="flex flex-col" key={key}>
            <label
              htmlFor={key}
              className="text-sm font-medium text-gray-600 mb-1"
            >
              {` ${
                key === "Class"
                  ? "Current Class"
                  : key.replace(/([A-Z])/g, " $1")
              }`}
            </label>

            {key === "Class" || key === "YearOfPassing" ? (
              <select
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">{`Select ${key.replace(
                  /([A-Z])/g,
                  " $1"
                )}`}</option>
                {key === "YearOfPassing" ? (
                  <option value="2024">2024</option>
                ) : (
                  Array.from({ length: 7 }, (_, i) => i + 6).map((classNum) => (
                    <option key={classNum} value={classNum}>
                      {convertToRoman(classNum)}
                    </option>
                  ))
                )}
              </select>
            ) : key === "Board" ? (
              <select
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option disabled value="">
                  Select Board
                </option>
                {boards.map((board, index) => (
                  <option key={index} value={board.name}>
                    {board.name}
                  </option>
                ))}
              </select>
            ) : (
              <div className="flex items-center">
                <input
                  type={key === "Percentage" ? "number" : "text"}
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
                  className={`border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none 
                    ${key === "Percentage" ? "w-1/3" : "w-full"}
                  `}
                />

                {key === "Percentage" && (
                  <span className="ml-2 tedxt-gray-600 text-sm">%</span>
                )}
              </div>
            )}

            {errors[key] && (
              <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center">
          {pathLocation === "/educationalDetailsForm" && (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition duration-200"
            >
              Previous
            </button>
          )}
          <button
            type="submit"
            className={`${
              pathLocation === "/educationalDetailsForm" ? "w-2/3" : "w-full"
            } bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200 ml-2`}
          >
            {checkUrl && paymentStatus === "Pending" ? "Payment" : "Update"}
          </button>
        </div>

        {submitMessage && (
          <p
            className={`text-sm text-center mt-4 ${
              submitMessage === "Form submitted successfully!"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {submitMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default EducationalDetailsForm;
