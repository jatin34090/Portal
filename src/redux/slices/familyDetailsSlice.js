import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Thunk to fetch family details
export const fetchFamilyDetails = createAsyncThunk(
  'familyDetails/fetchFamilyDetails',
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetch family details function is running");
      const response = await axios.get('/form/familyDetails/getForm');
      console.log(" fetch family details response.data", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching family details');
    }
  }
);

const familyDetailsSlice = createSlice({
  name: 'familyDetails',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateFamilyDetails(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFamilyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFamilyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchFamilyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateFamilyDetails } = familyDetailsSlice.actions;
export default familyDetailsSlice.reducer;
