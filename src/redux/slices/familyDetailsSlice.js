// src/redux/slices/familyDetailsSlice.js
import { createSlice } from "@reduxjs/toolkit";
import axios from "../../api/axios";

const initialState = {
  formData: {
    FatherName: "",
    FatherContactNumber: "",
    FatherOccupation: "",
    MotherName: "",
    MotherContactNumber: "",
    MotherOccupation: "",
    FamilyIncome: "",
  },
  isDataFetched: false,
  dataExist: false,
  loading: false,
  error: null,
  submitMessage: "",
};

const familyDetailsSlice = createSlice({
  name: "familyDetails",
  initialState,
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
    setIsDataFetched: (state, action) => {
      state.isDataFetched = action.payload;
    },
    setDataExist: (state, action) => {
      state.dataExist = action.payload;
    },
    setSubmitMessage: (state, action) => {
      state.submitMessage = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFormData,
  setIsDataFetched,
  setDataExist,
  setSubmitMessage,
  setLoading,
  setError,
} = familyDetailsSlice.actions;

export const fetchFamilyDetails = () => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const { data } = await axios.get("/form/familyDetails/getForm");
    if (data.length) {
      dispatch(setFormData(data[0]));
      dispatch(setIsDataFetched(true));
      dispatch(setDataExist(true));
    }
    dispatch(setLoading(false));
  } catch (error) {
    dispatch(setError("Error fetching family details."));
    dispatch(setLoading(false));
  }
};

export const submitFamilyDetails = (formData, dataExist) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    const endpoint = dataExist
      ? "/form/familyDetails/updateForm"
      : "/form/familyDetails/addForm";
    const method = dataExist ? axios.patch : axios.post;
    const response = await method(endpoint, formData);
    dispatch(setSubmitMessage(
      dataExist ? "Form updated successfully!" : "Form submitted successfully!"
    ));
    dispatch(setLoading(false));
    return response;
  } catch (error) {
    dispatch(setSubmitMessage("Submission error. Please try again."));
    dispatch(setLoading(false));
  }
};

export default familyDetailsSlice.reducer;
