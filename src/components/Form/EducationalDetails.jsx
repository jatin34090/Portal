import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  fetchEducationalDetails,
  fetchBoards,
  updateEducationalDetails,
} from "../../redux/slices/educationalDetailsSlice";
import checkoutHandler from "../../utils/Razorpay";

const EducationalDetailsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathLocation = location.pathname;

  // Fetching required state from Redux
  const { formData, boards, loading, error, dataExist } = useSelector(
    (state) => state.educationalDetails
  );
  const [submitMessage, setSubmitMessage] = useState("");
  const [checkUrl, setCheckUrl] = useState(false);
  const [paymentStatus, setPayementStatus] = useState("Pending");

  const [errors, setErrors] = useState("");

  // Checking if the current path is for the educational details form

  useEffect(() => {
    // Fetch boards and educational details when the component mounts
    dispatch(fetchBoards());
    dispatch(fetchEducationalDetails());
    setCheckUrl(pathLocation === "/educationalDetailsForm");
  }, [dispatch, pathLocation]);

  // Handler for form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateEducationalDetails({ [name]: value }));
    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key]?.toString().trim()) {
        formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };
  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    // Dispatch the submit action and pass the navigate and checkUrl params
    if (validateForm()) {
      try {
        console.log("dataExist", dataExist);
        const url = dataExist
          ? "/form/educationalDetails/updateForm"
          : "/form/educationalDetails/addForm";
        const method = dataExist ? axios.patch : axios.post;

        await method(url, formData);

        setSubmitMessage(
          dataExist
            ? "Educational details updated successfully!"
            : "Educational details submitted successfully!"
        );

        if (checkUrl) {
          // navigate("/familyDetailsForm");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitMessage("Error submitting form. Please try again.");
      }
    }
    // If payment is pending, trigger the Razorpay checkout handler
    if (checkUrl && paymentStatus === "Pending") {
      await checkoutHandler();
    }
  };

  // Convert class numbers to Roman numerals for the "Class" field
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

  // Display loading state while data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className={`${
        pathLocation === "/educationalDetailsForm" && "min-h-screen"
      } flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50`}
    >
      {loading ? (
        <Spinner />
      ) : (
        <form
          className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-6"
          onSubmit={onSubmit}
        >
          <h1 className="text-2xl font-bold text-center " style={{color: "#c61d23"}}>
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
                    Array.from({ length: 7 }, (_, i) => i + 6).map(
                      (classNum) => (
                        <option key={classNum} value={classNum}>
                          {convertToRoman(classNum)}
                        </option>
                      )
                    )
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
                    ${key === "Percentage" ? "w-1/3" : "w-full"}`}
                  />
                  {key === "Percentage" && (
                    <span className="ml-2 text-gray-600 text-sm">%</span>
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

              style={{backgroundColor: "#c61d23"}}
            >
              {checkUrl && paymentStatus === "Pending" ? "Payment" : "Update"}
            </button>
          </div>

          {submitMessage && (
            <p
              className={`text-sm text-center mt-4 ${
                submitMessage === "Educational details updated successfully!"
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {submitMessage}
            </p>
          )}
        </form>
      )}
    </div>
  );
};

export default EducationalDetailsForm;
