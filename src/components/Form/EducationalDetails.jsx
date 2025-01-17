import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import NotificationWithoutIndicator from "../../assets/NotificationWithoutIndicator.png";
import axios from "../../api/axios";
import {
  fetchEducationalDetails,
  fetchBoards,
  updateEducationalDetails,
} from "../../redux/slices/educationalDetailsSlice";
import checkoutHandler from "../../utils/Razorpay";
import { fetchUserDetails } from "../../redux/slices/userDeailsSlice";
import Sidebar from "../Sidebar";
import Navbar from "./Navbar";

const EducationalDetailsForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const pathLocation = location.pathname;

  // Fetching required state from Redux
  const {
    formData: educationalFormData,
    boards,
    loading,
    error,
    dataExist: educationalDataExist,
  } = useSelector((state) => state.educationalDetails);
  const { formData: familyFormData, dataExist: familyDataExist } = useSelector(
    (state) => state.familyDetails
  );

  const { userData } = useSelector((state) => state.userDetails);
  console.log("userData in DashboardHeader", userData);
  const [submitMessage, setSubmitMessage] = useState("");
  const [checkUrl, setCheckUrl] = useState(false);
  const [paymentStatus, setPayementStatus] = useState("Pending");

  const [errors, setErrors] = useState("");

  const { userData: userDetails } = useSelector((state) => state.userDetails);

  // Checking if the current path is for the educational details form

  useEffect(() => {
    // Fetch boards and educational details when the component mounts
    dispatch(fetchBoards());
    dispatch(fetchEducationalDetails());
    dispatch(fetchUserDetails());

    setCheckUrl(pathLocation === "/educationalDetailsForm");
    console.log("userData", userData);
    console.log("userData?.paymentId?.length", userData?.paymentId?.length);
  }, [dispatch, pathLocation]);
  useEffect(() => {
    console.log("userData?.paymentId?.length", userData?.paymentId?.length);
    setPayementStatus(userData?.paymentId?.length > 0 ? "Paid" : "Pending");
  }, [userData]);

  useEffect(() => {
    console.log("userData", userData);
  }, []);

  const { fromData } = useSelector((state) => state.userDetails);
  // Handler for form field changes
  const educationalHandleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateEducationalDetails({ [name]: value }));
    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const familyHandleChange = (e) => {
    const { name, value } = e.target;

    if (name === "MotherContactNumber" || name === "FatherContactNumber") {
      if (value.length > 10) {
        return;
      }
    }

    dispatch({
      type: "familyDetails/setFormData",
      payload: { ...familyFormData, [name]: value },
    });
  };


    // Income options
  const incomeRanges = [
    "Less than 1 Lakh",
    "1 Lakh - 5 Lakhs",
    "5 Lakhs - 10 Lakhs",
    "10 Lakhs - 20 Lakhs",
    "More than 20 Lakhs",
  ];


  const educationalValidateForm = () => {
    let formErrors = {};
    let isValid = true;

    Object.keys(educationalFormData).forEach((key) => {
      if (!educationalFormData[key]?.toString().trim()) {
        formErrors[key] = `${key.replace(/([A-Z])/g, " $1")} is required`;
        isValid = false;
      }
    });

    setErrors(formErrors);
    return isValid;
  };
  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    // Dispatch the submit action and pass the navigate and checkUrl params
    if (educationalValidateForm()) {
      try {
        console.log("dataExist", dataExist);
        const url = dataExist
          ? "/form/educationalDetails/updateForm"
          : "/form/educationalDetails/addForm";
        const method = dataExist ? axios.patch : axios.post;

        await method(url, educationalFormData);

        setSubmitMessage(
          dataExist
            ? "Educational details updated successfully!"
            : "Educational details submitted successfully!"
        );

        if (checkUrl) {
          // navigate("/familyDetailsForm");
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setSubmitMessage("Error submitting form. Please try again.");
      }
    }
    // If payment is pending, trigger the Razorpay checkout handler
    if (checkUrl && paymentStatus === "Pending" && educationalValidateForm()) {
      await checkoutHandler();
    } else if (!educationalValidateForm()) {
      setSubmitMessage("Please fill all the fields");
    } else {
      // if (checkUrl) {
      //   navigate("/dashboard");
      // }
    }
  };

  // Convert class numbers to Roman numerals for the "Class" field
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

  // Display loading state while data is being fetched
  // if (loading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div
      className="w-full h-screen overflow-auto "
      style={{ backgroundColor: "#c61d23" }}
    >
      <div className="grid grid-cols-7 ">
        <div className="col-span-1">
          <Sidebar />
        </div>

        <div className="flex flex-col col-span-6 ">
            <Navbar />
         

          <div
            className={`col-span-6 px-9 py-4  mb-3 mr-5 bg-gray-200 rounded-3xl flex flex-col items-end gap-4  overflow-auto`}
          >
            {/* {loading ? (
              <Spinner />
            ) : ( */}
            <div className=" w-full flex flex-col gap-4 h-full  bg-gray-200">
              <h3 className="text-2xl font-extrabold">User Details</h3>

              <div
                className="rounded-2xl "
                style={{ backgroundColor: "#c61d23" }}
              >
                <h1 className="text-xl font-bold px-4 py-2 text-white ">
                  Educational Details
                </h1>

                <form
                  className="flex flex-wrap gap-4  w-full bg-white shadow-lg p-2 rounded-b-2xl"
                  onSubmit={onSubmit}
                >
                  {/* <div
                      className="rounded-2xl "
                      style={{ backgroundColor: "#c61d23" }}
                    > */}
                  {Object.keys(educationalFormData).map((key) => (
                    <div className="flex flex-col w-2/5" key={key}>
                      <label
                        htmlFor={key}
                        className="text-sm font-medium text-gray-600 mb-1"
                      >
                        {` ${
                          key === "Class"
                            ? "Current Class"
                            : key.replace(/([A-Z])/g, " $1")
                        }`}
                      </label>

                      {key === "Class" || key === "YearOfPassing" ? (
                        <select
                          id={key}
                          name={key}
                          value={educationalFormData[key]}
                          onChange={educationalHandleChange}
                          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        >
                          <option value="">{`Select ${key.replace(
                            /([A-Z])/g,
                            " $1"
                          )}`}</option>
                          {key === "YearOfPassing" ? (
                            <option value="2024">2024</option>
                          ) : (
                            Array.from({ length: 7 }, (_, i) => i + 6).map(
                              (classNum) => (
                                <option key={classNum} value={classNum}>
                                  {convertToRoman(classNum)}
                                </option>
                              )
                            )
                          )}
                        </select>
                      ) : key === "Board" ? (
                        <select
                          id={key}
                          name={key}
                          value={educationalFormData[key]}
                          onChange={educationalHandleChange}
                          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        >
                          <option disabled value="">
                            Select Board
                          </option>
                          {boards.map((board, index) => (
                            <option key={index} value={board.name}>
                              {board.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center">
                          <input
                            type={key === "Percentage" ? "number" : "text"}
                            id={key}
                            name={key}
                            value={educationalFormData[key]}
                            onChange={educationalHandleChange}
                            placeholder={`Enter ${key.replace(
                              /([A-Z])/g,
                              " $1"
                            )}`}
                            className={`border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none 
                    ${key === "Percentage" ? "w-1/3" : "w-full"}`}
                          />
                          {key === "Percentage" && (
                            <span className="ml-2 text-gray-600 text-sm">
                              %
                            </span>
                          )}
                        </div>
                      )}

                      {errors.key && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.key}
                        </p>
                      )}
                    </div>
                  ))}
                  {/* </div> */}

                </form>
              </div>
              <div
                className="rounded-2xl "
                style={{ backgroundColor: "#c61d23" }}
              >
                <h1 className="text-xl font-bold px-4 py-2 text-white ">
                  Family Details
                </h1>

                <form
                  className="flex flex-wrap gap-4  w-full bg-white shadow-lg p-2 rounded-b-2xl"
                  onSubmit={onSubmit}
                >
                  {/* <div
                      className="rounded-2xl "
                      style={{ backgroundColor: "#c61d23" }}
                    > */}
                  {Object.keys(familyFormData).map((key) => (
                    <div className="flex flex-col w-2/5" key={key}>
                      <label
                        htmlFor={key}
                        className="text-sm font-medium text-gray-600 mb-1"
                      >
                        {` ${
                          key === "Class"
                            ? "Current Class"
                            : key.replace(/([A-Z])/g, " $1")
                        }`}
                      </label>

                      {key === "Class" || key === "YearOfPassing" ? (
                        <select
                          id={key}
                          name={key}
                          value={familyFormData[key]}
                          onChange={familyHandleChange}
                          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        >
                          <option value="">{`Select ${key.replace(
                            /([A-Z])/g,
                            " $1"
                          )}`}</option>
                          {key === "YearOfPassing" ? (
                            <option value="2024">2024</option>
                          ) : (
                            Array.from({ length: 7 }, (_, i) => i + 6).map(
                              (classNum) => (
                                <option key={classNum} value={classNum}>
                                  {convertToRoman(classNum)}
                                </option>
                              )
                            )
                          )}
                        </select>
                      ) : key === "Board" ? (
                        <select
                          id={key}
                          name={key}
                          value={familyFormData[key]}
                          onChange={familyHandleChange}
                          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                        >
                          <option disabled value="">
                            Select Board
                          </option>
                          {boards.map((board, index) => (
                            <option key={index} value={board.name}>
                              {board.name}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <div className="flex items-center">
                          <input
                            type={key === "Percentage" ? "number" : "text"}
                            id={key}
                            name={key}
                            value={familyFormData[key]}
                            onChange={familyHandleChange}
                            placeholder={`Enter ${key.replace(
                              /([A-Z])/g,
                              " $1"
                            )}`}
                            className={`border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none 
                    ${key === "Percentage" ? "w-1/3" : "w-full"}`}
                          />
                          {key === "Percentage" && (
                            <span className="ml-2 text-gray-600 text-sm">
                              %
                            </span>
                          )}
                        </div>
                      )}
                      {console.log("familyFormData", errors)}

                      {errors.key && (
                        <p className="text-red-500 text-xs mt-1">
                          {errors.key}
                        </p>
                      )}
                    </div>
                  ))}
                  {/* </div> */}

                 
                </form>
              </div>
              
              {submitMessage && (
                    <p
                      className={`text-sm text-center mt-4 ${
                        submitMessage ===
                          "Educational details updated successfully!" ||
                        submitMessage ===
                          "Educational details submitted successfully!"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {submitMessage}
                    </p>
                  )}
            </div>
            {/* )} */}
              {/* Submit and Previous Buttons */}
              <div className="flex justify-between items-center">
              {pathLocation === "/batchDetailsForm" && (
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="w-1/3 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                  Previous
                </button>
              )}

              <button
                type="button"
                onClick={onSubmit}
                className={` ${
                  pathLocation === "/batchDetailsForm" ? "w-2/3" : "w-full"
                }  hover:bg-indigo-600 text-white font-semibold py-2 px-9 rounded-full transition duration-200 ml-2`}
                style={{ backgroundColor: "#c61d23" }}
              >
                {checkUrl ? "Next" : "Update"}
              </button>
            </div>
          </div>
         
        </div>
      </div>
    </div>
  );
};

export default EducationalDetailsForm;
