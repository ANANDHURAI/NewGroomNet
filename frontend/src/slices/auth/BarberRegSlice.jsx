import { createSlice } from '@reduxjs/toolkit';

const initialState = {

  personalDetails: {
    name: '',
    email: '',
    phone: '',
    gender: '',
    password:'',
  },
 
  registrationData: {
    user_id: null,
    barber_request_id: null,
    registration_step: 'personal_details',
    status: 'pending'
  },

  tokens: {
    user_type:'',
    access: null,
    refresh: null
  },

  loading: {
    personalDetails: false,
    documentUpload: false,
    statusCheck: false
  },

  errors: {},

  successMessage: '',
  documents: {
    licence: null,
    certificate: null,
    profile_image: null
  }
};


const BarberRegistrationSlice = createSlice({
  name: 'barberRegistration',
  initialState,
  reducers: {
    updatePersonalDetails: (state, action) => {
      state.personalDetails = { ...state.personalDetails, ...action.payload };
    },
    setRegistrationData: (state, action) => {
      state.registrationData = { ...state.registrationData, ...action.payload };
    },
    setTokens: (state, action) => {
      state.tokens = action.payload;
    },
    updateDocuments: (state, action) => {
      state.documents = { ...state.documents, ...action.payload };
    },
    
    updateRegistrationStep: (state, action) => {
      state.registrationData.registration_step = action.payload;
    },
    updateStatus: (state, action) => {
      state.registrationData.status = action.payload;
    }
  },
 
});

export const {
  updatePersonalDetails,
  setRegistrationData,
  setTokens,
  updateDocuments,
  resetRegistration,
  updateRegistrationStep,
  updateStatus
} = BarberRegistrationSlice.actions;

export default BarberRegistrationSlice.reducer;