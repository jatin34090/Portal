import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// Thunk to fetch user details
export const fetchUserDetails = createAsyncThunk(
    'userDetails/fetchUserDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/students/getStudentsById');
            const data = response.data;
            console.log("Studennt  Data", data);

            if (data.length !== 0) {
                return {
                    dataExist: true, // Indicate data exists
                    userData: {
                        name: data?.name || '',
                        StudentsId: data?.StudentsId || '',
                        email: data?.email || '',
                        admitCard: data?.admitCard || '',
                        result: data?.result || '',
                        paymentId: data?.paymentId || '',
                        phone: data?.phone || '',
                    },
                };
            } else {
                return {
                    dataExist: false, // Indicate no data exists
                    formData: {}, // Default empty data
                };
            }
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch data');
        }
    }
);

// Slice
const userDetailsSlice = createSlice({
    name: 'userDetails',
    initialState: {
        userData: {},
        loading: false,
        error: null,
        dataExist: false, // New flag to indicate if data exists in the database

    },
    reducers: {
        updateUserDetails(state, action) {
            state.userData = { ...state.userData, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserDetails.fulfilled, (state, action) => {
                state.loading = false;
                state.userData = action.payload.userData;
                state.dataExist = action.payload.dataExist; // Update `dataExist`

            })
            .addCase(fetchUserDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { updateUserDetails } = userDetailsSlice.actions;
export default userDetailsSlice.reducer;
