import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import {
  fetchBasicDetails,
  updateBasicDetails,
} from "../../redux/slices/basicDetailsSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../api/Spinner";
import { setLoading } from "../../redux/slices/loadingSlice";
import Sidebar from "../Sidebar";

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
  const examDateOptions = ["15/02/2025", "02/20/2025", "10/03/2025"];

  useEffect(() => {
    setCheckUrl(location.pathname === "/basicDetailsForm");
    dispatch(fetchBasicDetails());
  }, [dispatch, location.pathname]);

  useEffect(()=>{
    dispatch(setLoading(false));

  }, []);

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
    console.log("name", name, "value", value);
    dispatch(updateBasicDetails({ [name]: value }));

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const onSubmit = async (e) => {
    setLoading(true);
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
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="w-full h-screen " style={{ backgroundColor: "#c61d23" }}>
      <div className=""></div>

      <div className="grid grid-cols-7">
        <div className="col-span-1">
          <Sidebar />
        </div>

        <div
          className={`col-span-6 p-5 mt-12 mb-5 mx-5 bg-white rounded-3xl flex justify-center `}
        >
          {
          // loading ? (
          //   // <Spinner />
          // ) : 
          
          // (
            <div className=" w-full flex flex-col gap-4">
              <h3 className="text-2xl font-extrabold">User Details</h3>

              <div className="rounded-xl " style={{ backgroundColor: "#c61d23" }}>
                <h1 className="text-xl font-bold px-4 py-2 text-white rounded-t-xl">
                  Basic Details
                </h1>
                <form
                  className="flex flex-wrap gap-9  w-full bg-white shadow-lg p-6 "
                  onSubmit={onSubmit}
                >
                  {/* <div className=" "> */}
                    {/* Date of Birth */}
                    <div className="flex flex-col w-2/5">
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.dob}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col  w-2/5">
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    {/* Exam Name */}
                    <div className="flex flex-col  w-2/5">
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.examName}
                        </p>
                      )}
                    </div>

                    {/* Exam Date */}
                    <div className="flex flex-col  w-2/5">
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.examDate}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    {/* <div className="flex justify-between items-center">
                      <button
                        type="submit"
                        className="w-full hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                        style={{ backgroundColor: "#c61d23" }}
                      >
                        {checkUrl ? "Next" : "Update"}
                      </button>
                    </div> */}

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
                  {/* </div> */}
                </form>
              </div>
              <div className="rounded-xl " style={{ backgroundColor: "#c61d23" }}>
                <h1 className="text-xl font-bold px-4 py-2 text-white rounded-t-xl">
                  Basic Details
                </h1>
                <form
                  className="flex flex-wrap gap-9  w-full bg-white shadow-lg p-6 "
                  onSubmit={onSubmit}
                >
                  {/* <div className=" "> */}
                    {/* Date of Birth */}
                    <div className="flex flex-col w-2/5">
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.dob}
                        </p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col  w-2/5">
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.gender}
                        </p>
                      )}
                    </div>

                    {/* Exam Name */}
                    <div className="flex flex-col  w-2/5">
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.examName}
                        </p>
                      )}
                    </div>

                    {/* Exam Date */}
                    <div className="flex flex-col  w-2/5">
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
                        <p className="text-red-500 text-xs mt-1">
                          {errors.examDate}
                        </p>
                      )}
                    </div>

                    {/* Submit Button */}
                    {/* <div className="flex justify-between items-center">
                      <button
                        type="submit"
                        className="w-full hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                        style={{ backgroundColor: "#c61d23" }}
                      >
                        {checkUrl ? "Next" : "Update"}
                      </button>
                    </div> */}

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
                  {/* </div> */}
                </form>
              </div>
            </div>
          // )
          }
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
