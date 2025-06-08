import { configureStore } from '@reduxjs/toolkit';
import loginReducer from '../slices/auth/LoginSlice';
import registerReducer from '../slices/auth/RegisterSlice';
import barberregReducer from '../slices/auth/BarberRegSlice';


export const store = configureStore({
  reducer: {
    login: loginReducer,
    register: registerReducer,
    barberRegistration: barberregReducer, 
    
  }
});

export default store;