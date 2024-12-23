import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Thunk to fetch educational details
export const fetchEducationalDetails = createAsyncThunk(
  'educationalDetails/fetchEducationalDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/students/educationalDetails');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching educational details');
    }
  }
);

const educationalDetailsSlice = createSlice({
  name: 'educationalDetails',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateEducationalDetails(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducationalDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEducationalDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchEducationalDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateEducationalDetails } = educationalDetailsSlice.actions;
export default educationalDetailsSlice.reducer;
