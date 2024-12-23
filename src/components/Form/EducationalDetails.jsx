import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { useNavigate } from "react-router-dom";

const EducationalDetailsForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    LastSchoolName: "",
    MarksObtained: "",
    TotalMarks: "",
    Class: "",
    YearOfPassing: "",
    Board: "",
  });

  const [dataExist, setDataExist] = useState(false);

  const [boards, setBoards] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch boards and form data in one go
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [boardsResponse, formDataResponse] = await Promise.all([
          axios.get("/board"),
          axios.get("/form/educationalDetails/getForm"),
        ]);
        
        console.log("formDataResponse", formDataResponse.data);
        if(formDataResponse.data.length != 0){
          setDataExist(true);
        }
        setBoards(boardsResponse.data);

        if (formDataResponse.data[0]) {
          const { LastSchoolName, MarksObtained, TotalMarks, Class, YearOfPassing, Board } = formDataResponse.data[0];
          setFormData({ LastSchoolName, MarksObtained, TotalMarks, Class, YearOfPassing, Board });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle input changes and error checking
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => {
      const updatedFormData = { ...prevFormData, [name]: value };

      // Error handling for Class and TotalMarks
      if (name === "Class" && (value < 1 || value > 12)) {
        setErrors((prevErrors) => ({ ...prevErrors, Class: "Class must be between 1 and 12" }));
      } else if (name === "TotalMarks" && value < prevFormData.MarksObtained) {
        setErrors((prevErrors) => ({ ...prevErrors, TotalMarks: "Total marks must be greater than marks obtained" }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
      }

      return updatedFormData;
    });
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = `${key} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const onSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const apiUrl = dataExist ? "/form/educationalDetails/updateForm" : "/form/educationalDetails/addForm";
        const method = dataExist ? axios.patch : axios.post;
        await method(apiUrl, formData);
        setSubmitMessage("Form submitted successfully!");
        navigate("/familyDetailsForm");
      } catch (error) {
        setSubmitMessage("Error submitting form");
        console.error("Error submitting form", error);
      }
    }
  };

  // Convert class number to Roman numeral
  const convertToRoman = (num) => {
    const romanNumerals = { 1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI", 7: "VII", 8: "VIII", 9: "IX", 10: "X", 11: "XI", 12: "XII" };
    return romanNumerals[num];
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-indigo-50">
      <form className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-6" onSubmit={onSubmit}>
        <h1 className="text-2xl font-bold text-center text-indigo-600">Educational Details Form</h1>

        {Object.keys(formData).map((key) => (
          <div className="flex flex-col" key={key}>
            <label htmlFor={key} className="text-sm font-medium text-gray-600 mb-1">{key.replace(/([A-Z])/g, " $1")}</label>
            
            {key === "Class" || key === "YearOfPassing" ? (
              <select id={key} name={key} value={formData[key]} onChange={handleChange} className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none">
                <option value="">{`Select ${key}`}</option>
                {key === "YearOfPassing" ? <option value="2024">2024</option> : Array.from({ length: 12 }, (_, i) => i + 1).map((classNum) => (
                  <option key={classNum} value={classNum}>{convertToRoman(classNum)}</option>
                ))}
              </select>
            ) : key === "Board" ? (
              <select id={key} name={key} value={formData[key]} onChange={handleChange} className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none">
                <option disabled value="">Select Board</option>
                {boards.map((board, index) => <option key={index} value={board.name}>{board.name}</option>)}
              </select>
            ) : (
              <input type={key === "MarksObtained" || key === "TotalMarks" ? "number" : "text"} id={key} name={key} value={formData[key]} onChange={handleChange} placeholder={`Enter ${key.replace(/([A-Z])/g, " $1")}`} className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none" />
            )}

            {errors[key] && <p className="text-red-500 text-xs mt-1">{errors[key]}</p>}
          </div>
        ))}

        <div className="flex justify-between items-center">
          <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 rounded-lg transition duration-200">Submit</button>
        </div>

        {submitMessage && (
          <p className={`text-sm text-center mt-4 ${submitMessage.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
            {submitMessage}
          </p>
        )}
      </form>
    </div>
  );
};

export default EducationalDetailsForm;
