import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  fetchBasicDetails,
  updateBasicDetails,
} from "../../redux/slices/basicDetailsSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../api/Spinner";

const BasicDetailsForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const {
    data: formData,
    loading,
    error,
    dataExist,
  } = useSelector((state) => state.basicDetails);

  const [checkUrl, setCheckUrl] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  // Dropdown options
  const genderOptions = ["Male", "Female", "Other"];
  const examNameOptions = ["S.Dat", "Rise"];
  const examDateOptions = ["2024-01-15", "2024-02-20", "2024-03-10"];

  useEffect(() => {
    setCheckUrl(location.pathname === "/basicDetailsForm");
    dispatch(fetchBasicDetails());
  }, [dispatch, location.pathname]);

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    ["dob", "gender", "examName", "examDate"].forEach((field) => {
      if (!formData?.[field]?.trim()) {
        formErrors[field] = `${field
          .replace(/([A-Z])/g, " $1")
          .toUpperCase()} is required.`;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateBasicDetails({ [name]: value }));

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

        await method(url, formData);
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
        setSubmitMessage("Error submitting form. Please try again.");
      }
    }
  };

  return (
    <div
      className={`${
        checkUrl ? "min-h-screen" : ""
      } flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-50`}
    >
      {loading ? (
        <Spinner />
      ) : (
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
              value={formData?.dob || ""}
              onChange={handleChange}
              max={new Date().toISOString().split("T")[0]}
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
              value={formData?.gender || ""}
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
              value={formData?.examName || ""}
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
              value={formData?.examDate || ""}
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
      )}
    </div>
  );
};

export default BasicDetailsForm;
