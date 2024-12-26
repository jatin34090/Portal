import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

const BasicDetailsForm = () => {
  const navigate = useNavigate();

  const location = useLocation();
  const [checkUrl, setCheckUrl] = useState("");
  const pathLocation = location.pathname;

  const [formData, setFormData] = useState({
    dob: "",
    gender: "",
    examName: "",
    examDate: "",
  });
  const [dataExist, setDataExist] = useState(false);

  const [errors, setErrors] = useState({
    dob: "",
    gender: "",
    examName: "",
    examDate: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");

  // Dropdown options
  const genderOptions = ["Male", "Female", "Other"];
  const examNameOptions = ["S.Dat", "Rise"];
  const examDateOptions = ["2024-01-15", "2024-02-20", "2024-03-10"];

  useEffect(() => {
    const fetchBasicDetails = async () => {
      try {
        const response = await axios.get("/form/basicDetails/getForm");
        const data = response.data;
        if (data.length !== 0) {
          setDataExist(true);
          setFormData({
            dob: data[0]?.dob.split("T")[0] || "",
            gender: data[0]?.gender || "",
            examName: data[0]?.examName || "",
            examDate: data[0]?.examDate.split("T")[0] || "",
          });
        }
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    fetchBasicDetails();
    setCheckUrl(location.pathname === "/basicDetailsForm");
    console.log("checkUrl", location.pathname);
    console.log("CKeckUrl", checkUrl);
  }, []);
  useEffect(() => {
    console.log("Form checkUrl form useEffect", checkUrl);
  }, [checkUrl]);

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const url = dataExist
          ? "/form/basicDetails/updateForm"
          : "/form/basicDetails/addForm";
        const method = dataExist ? axios.patch : axios.post;

        const response = await method(url, formData);
        setSubmitMessage(
          dataExist
            ? "Basic details updated successfully!"
            : "Basic details submitted successfully!"
        );

        if (checkUrl) {
          navigate("/batchDetailsForm");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitMessage(error.response.data);
      }
    }
  };

  return (
    <div
      className={`${
        pathLocation === "/basicDetailsForm" && "min-h-screen"
      } flex items-center justify-center  bg-gradient-to-r from-blue-50 to-indigo-50`}
    >
      <form
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-6"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Basic Details Form
        </h1>

        {/* Date of Birth */}
        <div className="flex flex-col">
          <label
            htmlFor="dob"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          {errors.dob && (
            <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
          )}
        </div>

        {/* Gender */}
        <div className="flex flex-col">
          <label
            htmlFor="gender"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">Select Gender</option>
            {genderOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
          )}
        </div>

        {/* Exam Name */}
        <div className="flex flex-col">
          <label
            htmlFor="examName"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Exam Name
          </label>
          <select
            id="examName"
            name="examName"
            value={formData.examName}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">Select Exam Name</option>
            {examNameOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.examName && (
            <p className="text-red-500 text-xs mt-1">{errors.examName}</p>
          )}
        </div>

        {/* Exam Date */}
        <div className="flex flex-col">
          <label
            htmlFor="examDate"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Exam Date
          </label>
          <select
            id="examDate"
            name="examDate"
            value={formData.examDate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">Select Exam Date</option>
            {examDateOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          {errors.examDate && (
            <p className="text-red-500 text-xs mt-1">{errors.examDate}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {checkUrl ? "Next" : "Update"}
          </button>
        </div>

        {/* Submit Message */}
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
