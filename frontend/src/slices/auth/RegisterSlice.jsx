import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  phone: "",
  password: "",
  isRegistering: false,
  user: null
};

export const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegisterData: (state, action) => {
      state.email = action.payload.email;
      state.name = action.payload.name;
      state.phone = action.payload.phone;
      state.password = action.payload.password;
    },
    setRegistering: (state, action) => {
      state.isRegistering = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearRegisterData: (state) => {
      state.name = '';
      state.email = '';
      state.phone = '';
      state.password = '';
      state.isRegistering = false;
    }
  }
});

export const { setRegisterData, setRegistering, setUser, clearRegisterData } = registerSlice.actions;
export default registerSlice.reducer;