import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Thunk to fetch basic details
export const fetchBasicDetails = createAsyncThunk(
  'basicDetails/fetchBasicDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/students/getBasicDetails');
      console.log("response.data come form redux slice", response.data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching basic details');
    }
  }
);

const basicDetailsSlice = createSlice({
  name: 'basicDetails',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateBasicDetails(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBasicDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBasicDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBasicDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateBasicDetails } = basicDetailsSlice.actions;
export default basicDetailsSlice.reducer;
