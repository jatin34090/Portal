import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useState, useEffect } from "react";

const FamilyDetails = () => {
  const navigate = useNavigate();

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

  // Handle input changes and immediate validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("value", value);
    console.log("name", name);
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if(name === "MotherContactNumber" || name === "FatherContactNumber" ){
    if (!phoneRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        [name]: `${name.replace(/([A-Z])/g, " $1")} must be a valid 10-digit number`,
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

  // General form validation
  const validateForm = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      let value = formData[key];

      if (typeof value === "string") {
        value = value.trim(); // Only trim strings
      }

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
      } else if (key === "FamilyIncome" && isNaN(value)) {
        newErrors[key] = "Family income must be a valid number";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form data
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
        if(!dataExist){

          navigate("/dashboard");
        }
        console.log("Response:", response);
      } catch (error) {
        setSubmitMessage("Error submitting form");
        console.error("Submission error:", error);
      }
    }
  };

  // Fetch existing family details for editing
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

        {Object.keys(formData).map((key) => (
          <div className="flex flex-col" key={key}>
            <label
              htmlFor={key}
              className="text-sm font-medium text-gray-600 mb-1"
            >
              {key.replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type={
                key === "FamilyIncome" || key === "FatherContactNumber" || key === "MotherContactNumber"
                  ? "number"
                  : key.includes("Number")
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
        ))}

        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200"
          >
           { dataExist ? "Update" : "Next"}
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

export default FamilyDetails;
