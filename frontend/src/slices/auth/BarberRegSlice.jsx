import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',  
  email: '',
  phone: '',
  gender: '',
  isMadeRequest: false,
  requestStatus: 'none',
  user: null,
  documents: {
    licence: null,
    certificate: null
  }
};

const BarberRegistrationSlice = createSlice({
    name: 'barber-registration',
    initialState,
    reducers: {
        personaldetails: (state, action) => {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.phone = action.payload.phone;
            state.gender = action.payload.gender;
        },
        requestToAdmin: (state) => {
            state.isMadeRequest = true;
            state.requestStatus = 'pending';
        },
        updateRequestStatus: (state, action) => {
            state.requestStatus = action.payload;
        },
        resetRegistration: (state) => {
            return initialState;
        }
    }
});

export const { personaldetails, requestToAdmin, updateRequestStatus, resetRegistration } = BarberRegistrationSlice.actions;
export default BarberRegistrationSlice.reducer;