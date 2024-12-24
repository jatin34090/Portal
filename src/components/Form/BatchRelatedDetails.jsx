import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const BatchRelatedDetailsForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    preferred_batch: "",
    subject_combination: "",
    session_start_date: "",
  });
  const [dataExist, setDataExist] = useState(false);

  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");

  // Options for select dropdowns
  const batchOptions = ["Batch 1", "Batch 2", "Batch 3", "Batch 4"];
  const subjectOptions = ["PCM", "PCB", "PCMB"];
  const sessionYearOptions = ["2024", "2025", "2026", "2027"];

  // Fetch initial form data
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response = await axios.get("/form/batchRelatedDetails/getForm");
        const data = response.data;
        console.log("data", data);
        console.log("data.length", data.length);
        if (data.length != 0) {
          setDataExist(true);
        }

        if (data.length > 0) {
          const sessionYear = new Date(data[0].session_start_date)
            .getFullYear()
            .toString();
          setFormData({
            preferred_batch: data[0].preferred_batch,
            subject_combination: data[0].subject_combination,
            session_start_date: sessionYear,
          });
        }
      } catch (error) {
        console.error("Error fetching batch data:", error);
      }
    };

    fetchBatchData();
  }, []);

  // Validate form fields
  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        formErrors[key] = `${key
          .replace(/_/g, " ")
          .replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log("dataExist", dataExist);
        const url = dataExist
          ? "/form/batchRelatedDetails/updateForm"
          : "/form/batchRelatedDetails/addForm";
        console.log("url", url);
        const method = dataExist ? axios.patch : axios.post;

        const response = await method(url, formData);
        setSubmitMessage(
          formData.preferred_batch
            ? "Batch related details updated successfully!"
            : "Batch related details submitted successfully!"
        );

        // Reset form data after successful submission
        setFormData({
          preferred_batch: "",
          subject_combination: "",
          session_start_date: "",
        });
        if (dataExist) {
          navigate("/educationalDetailsForm");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitMessage("Error submitting the form. Please try again.");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <form
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-6"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Batch Related Details Form
        </h1>

        {/* Preferred Batch */}
        <div className="flex flex-col">
          <label
            htmlFor="preferred_batch"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Preferred Batch
          </label>
          <select
            id="preferred_batch"
            name="preferred_batch"
            value={formData.preferred_batch}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">Select Preferred Batch</option>
            {batchOptions.map((batch, index) => (
              <option key={index} value={batch}>
                {batch}
              </option>
            ))}
          </select>
          {errors.preferred_batch && (
            <p className="text-red-500 text-xs mt-1">
              {errors.preferred_batch}
            </p>
          )}
        </div>

        {/* Subject Combination */}
        <div className="flex flex-col">
          <label
            htmlFor="subject_combination"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Subject Combination
          </label>
          <select
            id="subject_combination"
            name="subject_combination"
            value={formData.subject_combination}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">Select Subject Combination</option>
            {subjectOptions.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {errors.subject_combination && (
            <p className="text-red-500 text-xs mt-1">
              {errors.subject_combination}
            </p>
          )}
        </div>

        {/* Session Start Date */}
        <div className="flex flex-col">
          <label
            htmlFor="session_start_date"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Session Start Date
          </label>
          <select
            id="session_start_date"
            name="session_start_date"
            value={formData.session_start_date}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option value="">Select Session Start Date</option>
            {sessionYearOptions.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.session_start_date && (
            <p className="text-red-500 text-xs mt-1">
              {errors.session_start_date}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {dataExist ? "Update" : "Submit"}
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

export default BatchRelatedDetailsForm;
