import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useState, useEffect } from "react";

const FamilyDetails = () => {
  const navigate = useNavigate();
const location = useLocation();
  const [checkUrl, setCheckUrl] = useState("");

  const pathLocation = location.pathname;

  const [formData, setFormData] = useState({
    FatherName: "",
    FatherContactNumber: "",
    FatherOccupation: "",
    MotherName: "",
    MotherContactNumber: "",
    MotherOccupation: "",
    FamilyIncome: "",
  });

  const [dataExist, setDataExist] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false);

  const phoneRegex = /^[0-9]{10}$/;

  // Income options
  const incomeRanges = [
    "Less than 1 Lakh",
    "1 Lakh - 5 Lakhs",
    "5 Lakhs - 10 Lakhs",
    "10 Lakhs - 20 Lakhs",
    "More than 20 Lakhs",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "MotherContactNumber" || name === "FatherContactNumber") {
      if (value.length > 10) {
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "MotherContactNumber" || name === "FatherContactNumber") {
      if (!phoneRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          [name]: `${name.replace(
            /([A-Z])/g,
            " $1"
          )} must be a valid 10-digit number`,
        }));
        return;
      }
    }

    setErrors((prev) => ({
      ...prev,
      [name]: value.trim()
        ? ""
        : `${name.replace(/([A-Z])/g, " $1")} is required`,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const value = formData[key]?.trim();

      if (!value) {
        newErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
      } else if (
        (key === "FatherContactNumber" || key === "MotherContactNumber") &&
        !phoneRegex.test(value)
      ) {
        newErrors[key] = `${key.replace(
          /([A-Z])/g,
          " $1"
        )} must be a valid 10-digit number`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const endpoint = dataExist
          ? "/form/familyDetails/updateForm"
          : "/form/familyDetails/addForm";
        const method = dataExist ? axios.patch : axios.post;
        const response = await method(endpoint, formData);
        setSubmitMessage(
          isDataFetched
            ? "Form updated successfully!"
            : "Form submitted successfully!"
        );
        if (checkUrl) {
          navigate("/educationalDetailsForm");
        }
        console.log("Response:", response);
      } catch (error) {
        setSubmitMessage(error.response?.data || "Submission error");
        console.error("Submission error:", error);
      }
    }
  };

  useEffect(() => {
    const fetchFamilyDetails = async () => {
      try {
        const { data } = await axios.get("/form/familyDetails/getForm");
        if (data.length) {
          setFormData(data[0]);
          setIsDataFetched(true);
          setDataExist(true);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchFamilyDetails();
    setCheckUrl(pathLocation === "/familyDetailsForm");
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <form
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-6"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Family Details Form
        </h1>

        {Object.keys(formData).map((key) => {
          if (key === "FamilyIncome") {
            return (
              <div className="flex flex-col" key={key}>
                <label
                  htmlFor={key}
                  className="text-sm font-medium text-gray-600 mb-1"
                >
                  Family Income
                </label>
                <select
                  id={key}
                  name={key}
                  value={formData[key]}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                >
                  <option value="">Select Family Income</option>
                  {incomeRanges.map((range, index) => (
                    <option key={index} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                {errors[key] && (
                  <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
                )}
              </div>
            );
          }

          return (
            <div className="flex flex-col" key={key}>
              <label
                htmlFor={key}
                className="text-sm font-medium text-gray-600 mb-1"
              >
                {key.replace(/([A-Z])/g, " $1")}
              </label>
              <input
                type={
                  key === "FatherContactNumber" || key === "MotherContactNumber"
                    ? "tel"
                    : "text"
                }
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`}
                className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              />
              {errors[key] && (
                <p className="text-red-500 text-xs mt-1">{errors[key]}</p>
              )}
            </div>
          );
        })}

        <div className="flex justify-between items-center">
          {pathLocation === "/familyDetailsForm" &&  <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
            Previous
          </button>}
          <button
            type="submit"
            className={`${pathLocation === "/familyDetailsForm" ?  "w-2/3" : "w-full"} bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200 ml-2`}
          >
            {checkUrl ?  "Next" : "Update"}
          </button>
        </div>

        {submitMessage && (
          <p
            className={`text-sm text-center mt-4 ${
              submitMessage=== "Form updated successfully!" ||
              submitMessage=== "Form submitted successfully!"
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

export default FamilyDetails;
