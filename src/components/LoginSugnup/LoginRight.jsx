import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function LoginRight() {
  const navigate = useNavigate();
  const {login} = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [submitMessage, setSubmitMessage] = useState("");



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: value ? "" : `${name} is required` }));
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    // Check if both email and password are provided
    if (!formData.email) {
      formErrors.email = "Email is required";
      isValid = false;
    }

    if (!formData.password) {
      formErrors.password = "Password is required";
      isValid = false;
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      formErrors.email = "Email must be a valid email address";
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await axios.post("/auth/student_login", formData);
        setSubmitMessage("Login successful!");
        login();
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard"); // Redirect to dashboard after successful login
      } catch (error) {
        setSubmitMessage("Error logging in");
        console.error("Error logging in", error);
      }
    }
  };

  return (
    <form className="flex flex-col gap-6 w-full max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg justify-center" onSubmit={onSubmit}>

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

      {submitMessage && (
        <p className={`text-center text-sm ${submitMessage.includes("successful") ? "text-green-500" : "text-red-500"}`}>
          {submitMessage}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
      >
        Login
      </button>
    </form>
  );
}
