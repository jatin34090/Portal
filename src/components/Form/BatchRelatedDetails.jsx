import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const BatchRelatedDetailsForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    preferredBatch: "",
    subjectCombination: "",
    sessionStartDate: "",
  });
  const [dataExist, setDataExist] = useState(false);

  const [errors, setErrors] = useState({
    preferredBatch: "",
    subjectCombination: "",
    sessionStartDate: "",
  });
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
        console.log("data hhh", data);
        console.log("data.length", data.length);
        if (data.length != 0) {
          setDataExist(true);
        }
        console.log("DATA", data);
        if (data.length > 0) {
          const sessionYear = new Date(data[0].sessionStartDate)
            .getFullYear()
            .toString();
          setFormData({
            preferredBatch: data[0].preferredBatch,
            subjectCombination: data[0].subjectCombination,
            sessionStartDate: sessionYear,
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
    let formErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim()) {
        console.log("key", key);
        formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
        console.log("formErrors", formErrors[key]);
        console.log("key", key);
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("value", value);
    console.log("name", name);
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  useEffect(() => {
    console.log("formData", formData);
  }, []);

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("dataExist", validateForm());

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
          formData.preferredBatch
            ? "Batch related details updated successfully!"
            : "Batch related details submitted successfully!"
        );
        console.log("response", response);
        
        if (dataExist) {
          setFormData({
            preferredBatch: response.data.preferredBatch,
            subjectCombination: response.data.subjectCombination,
            sessionStartDate: response.data.sessionStartDate,
          })
        }
        // Reset form data after successful submission
        setFormData({
          preferredDatch: "",
          subjectCombination: "",
          sessionStartDate: "",
        });
        if (!dataExist) {
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
            htmlFor="preferredBatch"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Preferred Batch
          </label>
          <select
            id="preferredBatch"
            name="preferredBatch"
            value={formData.preferredBatch}
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
          {errors.preferredBatch && (
            <p className="text-red-500 text-xs mt-1">{errors.preferredBatch}</p>
          )}
        </div>

        {/* Subject Combination */}
        <div className="flex flex-col">
          <label
            htmlFor="subjectCombination"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Subject Combination
          </label>
          <select
            id="subjectCombination"
            name="subjectCombination"
            value={formData.subjectCombination}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option disabled >Select Subject Combination</option>
            {subjectOptions.map((subject, index) => (
              <option key={index} value={subject}>
                {subject}
              </option>
            ))}
          </select>
          {errors.subjectCombination && (
            <p className="text-red-500 text-xs mt-1">
              {errors.subjectCombination}
            </p>
          )}
        </div>

        {/* Session Start Date */}
        <div className="flex flex-col">
          <label
            htmlFor="sessionStartDate"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Session Start Date
          </label>
          <select
            id="sessionStartDate"
            name="sessionStartDate"
            value={formData.sessionStartDate}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option disabled >Select Session Start Date</option>
            {sessionYearOptions.map((year, index) => (
              <option key={index} value={year}>
                {year}
              </option>
            ))}
          </select>
          {errors.sessionStartDate && (
            <p className="text-red-500 text-xs mt-1">
              {errors.sessionStartDate}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            {dataExist ? "Update" : "Next"}
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
