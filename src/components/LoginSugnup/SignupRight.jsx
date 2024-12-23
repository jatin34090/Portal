import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function SignupRight() {
  const navigate = useNavigate();
  
  // Regex pattern for phone number validation (+91 followed by 10 digits)
  const phoneRegex = /^\+91[0-9]{10}$/;
  
  // State hooks for form data, error messages, code box visibility, and submission message
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  // Handle form input changes and validation
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: value ? "" : `${name} is required` }));
  };

  // Validate form data before submission
  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    // Check if any field is empty
    ["name", "email", "phone", "password"].forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = `${field} is required`;
        isValid = false;
      }
    });

    // Validate email format
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Email must be a valid email address";
      isValid = false;
    }

    // Validate phone number format
    if (!phoneRegex.test(`+91${formData.phone}`)) {
      formErrors.phone = "Phone number must be a valid 10-digit number";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  // Submit form data
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage(""); // Reset submit message on new submit attempt

    if (validateForm()) {
      try {
        const response = await axios.post("/auth/student_signup", formData);
        setSubmitMessage("Form submitted successfully!");
        localStorage.setItem("token", response.data.token);
        navigate("/basicDetailsForm");
      } catch (error) {
        setSubmitMessage("Error submitting form");
        console.error("Error submitting form", error);
      }
    }
  };

  // Send phone verification code
  const verifyPhoneNo = async () => {
    try {
      const response = await axios.post("/students/sendVerification", {
        phone: `+91${formData.phone}`,
      });
      if (response.status === 200) {
        setShowCodeBox(true);
      }
    } catch (error) {
      setSubmitMessage("Error verifying phone number");
    }
  };

  // Check verification code
  const checkVerificationCode = async () => {
    try {
      const response = await axios.post("/students/verifyNumber", {
        phone: `+91${formData.phone}`,
        code,
      });
      if (response.status === 200) {
        setSubmitMessage("Phone number verified successfully!");
      }
    } catch (error) {
      setSubmitMessage("Error verifying phone number");
    }
  };

  return (
    <form className="flex flex-col gap-6 w-full mx-auto p-6 bg-white shadow-lg rounded-lg" onSubmit={onSubmit}>

      {/* Name Field */}
      <div className="flex flex-col items-start">
        <label htmlFor="name" className="text-gray-600">Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter Your Name"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
      </div>

      {/* Email Field */}
      <div className="flex flex-col items-start">
        <label htmlFor="email" className="text-gray-600">Email</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter Your Email"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
      </div>

      {/* Phone Field */}
      <div className="flex gap-4 items-center">
        <div className="flex flex-col flex-1 items-start">
          <label htmlFor="phone" className="text-gray-600">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter Your Phone No."
            className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          />
          {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
        </div>
        <div className="mt-6">
          {showCodeBox ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                id="code"
                name="code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter Code"
                className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={checkVerificationCode}
                className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md"
              >
                Verify Code
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={verifyPhoneNo}
              className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
            >
              Verify
            </button>
          )}
        </div>
      </div>

      {/* Password Field */}
      <div className="flex flex-col items-start">
        <label htmlFor="password" className="text-gray-600">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Password"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        />
        {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <p className={`text-center text-sm ${submitMessage.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
          {submitMessage}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
      >
        Submit
      </button>
    </form>
  );
}

