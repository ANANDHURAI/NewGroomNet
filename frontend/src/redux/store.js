import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../slices/auth/LoginSlice';
import registerReducer from '../slices/auth/RegisterSlice';
import barberregReducer from '../slices/auth/BarberRegSlice';
import barberloginReducer from '../slices/auth/BarberLogSlice';

export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    barberReg: barberregReducer,
    barberlogin: barberloginReducer
  }
});

export default store; 
