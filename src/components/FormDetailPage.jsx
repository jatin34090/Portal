import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFamilyDetails,
  updateFamilyDetails,
} from "../redux/slices/familyDetailsSlice";

const FormDetailPage = () => {
  const [forms, setForms] = useState({
    basicDetails: {
      name: "",
      email: "",
      phone: "",
      address: "",
      dob: "",
      gender: "",
    },
    batchDetails: {
      batch: "",
      course: "",
      enrollmentDate: "",
      mentor: "",
    },
    educationalDetails: {
      highestQualification: "",
      school: "",
      yearOfPassing: "",
      percentage: "",
    },
    familyDetails: {
      fatherName: "",
      motherName: "",
      guardianContact: "",
      address: "",
    },
  });

  const dispatch = useDispatch();
  const { data } = useSelector((state) => state.familyDetails);

  useEffect(() => {
    setForms({ familyDetails: data });
  }, []);
  useEffect(() => {
    console.log("forms", forms);
  }, [forms]);

  useEffect(() => {
    dispatch(fetchFamilyDetails());
  }, [dispatch]);

  const handleUpdate = () => {
    dispatch(updateFamilyDetails({ guardianName: "Updated Guardian Name" }));
  };
  useEffect(() => {
    handleUpdate();
  }, []);

  const [editingForm, setEditingForm] = useState(null); // Tracks the currently editing form
  const [updatedForms, setUpdatedForms] = useState(forms);

  //  const fetchFormData = async () => {
  //   try {
  //     const response = await axios.get('/students/getAllFormDetails'); // Adjust API endpoint
  //     setForms(response.data);
  //     setUpdatedForms(response.data);
  //     console.log('Form data fetched successfully:', response.data);
  //   } catch (error) {
  //     console.error('Error fetching form data:', error);
  //   }
  // };

  // useEffect(() => {
  //   // fetchFormData();
  // }, []);

  const handleEditChange = (formName, fieldName, value) => {
    setUpdatedForms((prev) => ({
      ...prev,
      [formName]: {
        ...prev[formName],
        [fieldName]: value,
      },
    }));
  };

  const handleUpdateForm = async (formName) => {
    try {
      const response = await axios.put(
        `/students/updateForm/${formName}`,
        updatedForms[formName]
      );
      setForms((prev) => ({
        ...prev,
        [formName]: updatedForms[formName],
      }));
      setEditingForm(null);
      console.log(`${formName} updated successfully:`, response.data);
    } catch (error) {
      console.error(`Error updating ${formName}:`, error);
    }
  };

  const toggleEditing = (formName) => {
    setEditingForm(editingForm === formName ? null : formName);
  };

  const renderForm = (formName, formFields) => {
    return (
      <div className="bg-white p-6 rounded shadow-lg mb-6">
        <h3 className="text-xl font-semibold mb-4">{formName}</h3>
        {editingForm === formName ? (
          <div>
            {formFields && Object.keys(formFields)?.map((field) => (
              <div className="mb-4" key={field}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={updatedForms[formName][field] || ""}
                  onChange={(e) =>
                    handleEditChange(formName, field, e.target.value)
                  }
                  className="mt-1 p-2 w-full border border-gray-300 rounded"
                />
              </div>
            ))}

            <button
              className="bg-indigo-500 text-white py-2 px-4 rounded"
              onClick={() => handleUpdateForm(formName)}
            >
              Save Changes
            </button>
            <button
              className="bg-gray-300 text-black py-2 px-4 rounded ml-2"
              onClick={() => setEditingForm(null)}
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            {formFields &&
              Object.keys(formFields)?.map((field) => (
                <p className="text-gray-700" key={field}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}:{" "}
                  {formFields[field]}
                </p>
              ))}
            <button
              className="bg-indigo-500 text-white py-2 px-4 rounded mt-4"
              onClick={() => toggleEditing(formName)}
            >
              Edit {formName}
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-semibold mb-8">Student Forms</h1>
      {renderForm("basicDetails", forms.basicDetails)}
      {renderForm("batchDetails", forms.batchDetails)}
      {renderForm("educationalDetails", forms.educationalDetails)}
      {renderForm("familyDetails", forms.familyDetails)}
    </div>
  );
};

export default FormDetailPage;
