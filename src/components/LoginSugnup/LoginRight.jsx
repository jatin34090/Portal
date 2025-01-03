import { useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

export default function LoginRight() {
  const navigate = useNavigate();
  const { login } = useAuth();

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
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const validateForm = () => {
    const formErrors = {};
    let isValid = true;

    if (!formData.email) {
      formErrors.email = "Email is required";
      isValid = false;
    }

    if (!formData.password) {
      formErrors.password = "Password is required";
      isValid = false;
    }

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
        document.cookie = `token=${response.data.token}`;
        navigate("/dashboard");
      } catch (error) {
        setSubmitMessage(error.response.data);
        console.error("Error logging in", error);
      }
    }
  };

  return (
    <form
      className="flex flex-col gap-6 w-1/2 max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg justify-center border border-gray-200"
      onSubmit={onSubmit}
    >
      <h2 className="text-2xl font-bold text-center text-indigo-600">Login</h2>

      <div className="flex flex-col items-start">
        <label htmlFor="email" className="text-gray-600">
          Email
        </label>
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
        <label htmlFor="password" className="text-gray-600">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter Password"
          className="border border-gray-300 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
        />
        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      {submitMessage && (
        <p
          className={`text-center text-sm ${
            submitMessage.includes("successful")
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {submitMessage}
        </p>
      )}

      <button
        type="submit"
        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
      >
        Login
      </button>

      <div className="text-center mt-4">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <button
            className="text-blue-500 font-medium hover:underline"
            onClick={() => navigate("/signup")}
            type="button"
          >
            Sign up here
          </button>
        </p>
        <button
          className="text-blue-500 font-medium hover:underline mt-2"
          onClick={() => navigate("/forgetPassword")}
          type="button"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  );
}
