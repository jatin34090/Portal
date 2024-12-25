import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";

export default function SignupRight() {
  const navigate = useNavigate();

  // Regex pattern for phone number validation (+91 followed by 10 digits)
  const phoneRegex = /^\+91[0-9]{10}$/;

  // State hooks
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: value ? "" : `${name} is required` }));
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    // Field validation
    ["name", "email", "phone", "password"].forEach((field) => {
      if (!formData[field]) {
        formErrors[field] = `${field} is required`;
        isValid = false;
      }
    });

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Email must be valid";
      isValid = false;
    }

    if (!phoneRegex.test(`+91${formData.phone}`)) {
      formErrors.phone = "Phone must be a valid 10-digit number";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitMessage("");

    if (validateForm()) {
      try {
        const response = await axios.post("/auth/student_signup", formData);
        setSubmitMessage("Form submitted successfully!");
        localStorage.setItem("token", response.data.token);
        navigate("/basicDetailsForm");
      } catch (error) {
        console.log("Error submitting form 2", error.response.data);
        setSubmitMessage(error.response.data);

        console.error("Error submitting form", error);
        
      }
    }
  };

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
    <div className="flex bg-gradient-to-r from-blue-50 to-indigo-100">
      <form
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-6"
        onSubmit={onSubmit}
      >
        <h1 className="text-2xl font-bold text-center text-indigo-600">
          Create Your Account
        </h1>

        {/* Name Field */}
        <div className="flex flex-col">
          <label htmlFor="name" className="text-sm font-medium text-gray-600 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Email Field */}
        <div className="flex flex-col">
          <label htmlFor="email" className="text-sm font-medium text-gray-600 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone Field */}
        <div className="flex gap-4 items-start">
          <div className="flex-1 flex flex-col">
            <label htmlFor="phone" className="text-sm font-medium text-gray-600 mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
                  placeholder="Enter code"
                  className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={checkVerificationCode}
                  className="px-4 py-2 text-white bg-green-500 hover:bg-green-600 rounded-md"
                >
                  Verify
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={verifyPhoneNo}
                className="px-4 py-2 text-white bg-blue-500 hover:bg-blue-600 rounded-md"
              >
                Send Code
              </button>
            )}
          </div>
        </div>

        {/* Password Field */}
        <div className="flex flex-col">
          <label htmlFor="password" className="text-sm font-medium text-gray-600 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <p
            className={`text-sm text-center mt-4 ${
              submitMessage.includes("successfully") ? "text-green-500" : "text-red-500"
            }`}
          >
            {submitMessage}
          </p>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Sign Up
        </button>

        {/* Login Link */}
        <p className="text-sm text-gray-600 text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-indigo-500 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
