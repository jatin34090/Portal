import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { data, useLocation, useNavigate } from "react-router-dom";

const BatchRelatedDetailsForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const pathLocation = location.pathname;
  const [checkUrl, setCheckUrl] = useState("");

  const [formData, setFormData] = useState({
    classForAdmission: "",
    preferredBatch: "",
    subjectCombination: "",
  });
  const [dataExist, setDataExist] = useState(false);

  const [errors, setErrors] = useState({
    classForAdmission: "",
    preferredBatch: "",
    subjectCombination: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");

  // Options for select dropdowns
  const batchOptions =
    formData.classForAdmission <= 10
      ? ["12-12-2024", "13-01-2025", "24-01-2025", "25-01-2025"]
      : ["16-12-2024", "17-01-2025", "28-01-2025", "29-01-2025"];

  let subjectOptions =
    formData.classForAdmission >= 5 && formData.classForAdmission <= 10
      ? [""]
      : ["PCM", "PCB"];
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

  // Fetch initial form data
  useEffect(() => {
    const fetchBatchData = async () => {
      try {
        const response = await axios.get("/form/batchRelatedDetails/getForm");
        const data = response.data;
        if (data.length !== 0) {
          setDataExist(true);
        }
        if (data.length > 0) {
          // const sessionYear = new Date(data[0].sessionStartDate)
          //   .getFullYear()
          //   .toString();
          setFormData({
            preferredBatch: data[0].preferredBatch,
            subjectCombination: data[0].subjectCombination,
            classForAdmission: data[0].classForAdmission,
          });
        }
      } catch (error) {
        console.error("Error fetching batch data:", error);
      }
    };

    fetchBatchData();
    setCheckUrl(pathLocation === "/batchDetailsForm");
  }, []);

  // Validate form fields
  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    console.log("formData", formData);
    Object.keys(formData).forEach((key) => {
      if (!(key === "subjectCombination" && formData.classForAdmission <= 10)) {
        console.log("formData[key].trim() 2", formData[key]?.toString().trim());
        if (!formData[key]?.toString().trim()) {
          formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
          isValid = false;
        }
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

  useEffect(() => {
    console.log("formData", formData);
  }, [formData]);

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const url = dataExist
          ? "/form/batchRelatedDetails/updateForm"
          : "/form/batchRelatedDetails/addForm";
        const method = dataExist ? axios.patch : axios.post;

        const response = await method(url, formData);
        setSubmitMessage(
          dataExist
            ? "Batch related details updated successfully!"
            : "Batch related details submitted successfully!"
        );

        if (checkUrl) {
          navigate("/familyDetailsForm");
        } else {
          setFormData({
            preferredBatch: "",
            subjectCombination: "",
            classForAdmission: "",
          });
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitMessage(error.response.data);
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

        {/* Class  for admission*/}
        <div className="flex flex-col">
          <label
            htmlFor="classForAdmission"
            className="text-sm font-medium text-gray-600 mb-1"
          >
            Class
          </label>
          <select
            id="classForAdmission"
            name="classForAdmission"
            value={formData.classForAdmission}
            onChange={handleChange}
            placeholder="Select Class for adminssion"
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          >
            <option className="text-gray-200" disabled selected hidden value="">
              Select Class for adminssion
            </option>
            {Array.from({ length: 7 }, (_, i) => i + 6).map((classNum) => (
              <option key={classNum} value={classNum}>
                {convertToRoman(classNum)}
              </option>
            ))}
          </select>
          {errors.classForAdmission && (
            <p className="text-red-500 text-xs mt-1">
              {errors.classForAdmission}
            </p>
          )}
        </div>

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
        {formData.classForAdmission >= 11 && (
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
              <option disabled value="">
                Select Subject Combination
              </option>
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
        )}

        {/* Submit and Previous Buttons */}
        <div className="flex justify-between items-center">
          {pathLocation === "/batchRelatedDetailsForm" && (
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
            className={` ${pathLocation === "/batchRelatedDetailsForm" ? "w-2/3" : "w-full"} bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200 ml-2`}
          >
            {checkUrl ? "Next" : "Update"}
          </button>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <p
            className={`text-sm text-center mt-4 ${
              submitMessage === "Batch related details updated successfully!"
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
