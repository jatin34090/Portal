import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const BasicDetailsForm = () => {
  const navigate = useNavigate();

  // State for form data
  const [formData, setFormData] = useState({
    dob: "",
    gender: "",
    examName: "",
    examDate: "",
  });

  // State for validation errors
  const [errors, setErrors] = useState({
    dob: "",
    gender: "",
    examName: "",
    examDate: "",
  });

  // State for submission message
  const [submitMessage, setSubmitMessage] = useState("");

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    // Clear error for the updated field if it's not empty
    if (value.trim() !== "") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  // Validate the form fields
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim() && key !== "admitCard") {
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
    const isValid = validateForm();

    if (isValid) {
      try {
        const response = await axios.post("/form/basicDetails/addForm", formData);
        setSubmitMessage("Basic details submitted successfully!");
        console.log(response.data);
        navigate("/batchDetailsForm");

        setFormData({
          dob: "",
          gender: "",
          examName: "",
          examDate: "",
        });
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitMessage("Error submitting the form. Please try again.");
      }
    }
  };

  // Function to format date to YYYY-MM-DD
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    console.log("date", date.toISOString());
    return date.toISOString().split("T")[0]; // Extracts YYYY-MM-DD
  };

  // Fetch form data on component mount
  useEffect(() => {
    const fetchBasicDetails = async () => {
      try {
        const response = await axios.get("/form/basicDetails/getForm");
        const data = response.data;

        console.log("Fetched Data:", data);

        setFormData({
          dob: formatDate(data[0]?.dob),  // Format dob
          gender: data[0]?.gender || "",
          examName: data[0]?.examName || "",
          examDate: formatDate(data[0]?.examDate),  // Format examDate
        });
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchBasicDetails();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <form
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-6"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Basic Details Form
        </h1>

        {Object.keys(formData).map((key) => (
          <div className="flex flex-col" key={key}>
            <label htmlFor={key} className="text-sm font-medium text-gray-600 mb-1">
              {key.replace(/([A-Z])/g, " $1")}
            </label>

            {key === "dob" ? (
              <input
                type="date"
                id={key}
                name={key}
                value={formData[key]} // Bind to formData.dob
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            ) : key === "gender" ? (
              <select
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            ) : key === "examName" ? (
              <select
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              >
                <option value="">Select Exam Name</option>
                <option value="S.Dat">S.Dat</option>
                <option value="Rise">Rise</option>
              </select>
            ) : (
              <input
                type="text"
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
            )}

            {errors[key] && (
              <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
            )}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Submit
          </button>
        </div>

        {submitMessage && (
          <p
            className={`text-sm text-center mt-4 ${
              submitMessage.includes("successfully")
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

export default BasicDetailsForm;