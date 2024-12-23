import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

export const fetchBatchDetails = createAsyncThunk(
  'batchDetails/fetchBatchDetails',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/students/batchDetails');
      return response.data;
      console.log(response.data);
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Error fetching batch details');
    }
  }
);


const batchDetailsSlice = createSlice({
  name: 'batchDetails',
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {
    updateBatchDetails(state, action) {
      state.data = { ...state.data, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBatchDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBatchDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchBatchDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { updateBatchDetails } = batchDetailsSlice.actions;
export default batchDetailsSlice.reducer;
