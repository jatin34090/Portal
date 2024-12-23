import { configureStore } from '@reduxjs/toolkit';
import basicDetailsReducer from './slices/basicDetailsSlice';
import batchDetailsReducer from './slices/batchDetailsSlice';
import educationalDetailsReducer from './slices/educationalDetailsSlice';
import familyDetailsReducer from './slices/familyDetailsSlice';

// Configure Redux Store
const store = configureStore({
  reducer: {
    // Adding each slice to the store
    basicDetails: basicDetailsReducer,
    batchDetails: batchDetailsReducer,
    educationalDetails: educationalDetailsReducer,
    familyDetails: familyDetailsReducer,
  },
});

export default store;
