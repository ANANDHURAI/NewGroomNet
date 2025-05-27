import { createSlice } from '@reduxjs/toolkit';


const getInitialState = () => {
  const hasToken = !!localStorage.getItem('access_token');
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  
  return {
    email: localStorage.getItem('user_email') || '',
    password: '',
    isLogin: hasToken,
    user: null,
    isAdmin: isAdmin,
  };
};

const initialState = getInitialState();

const LoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login: (state, action) => {
      state.email = action.payload.email;
      state.password = action.payload.password;
      state.isLogin = true;
      state.user = action.payload.user || null;
      state.isAdmin = false;
      
      localStorage.setItem('user_email', action.payload.email);
      localStorage.removeItem('is_admin');
    },
    adminlogin: (state, action) => {
      state.isLogin = true;
      state.email = action.payload.email;
      state.user = action.payload.user;
      state.isAdmin = true;
      
      localStorage.setItem('user_email', action.payload.email);
      localStorage.setItem('is_admin', 'true');
    },
    refreshTokens: (state, action) => {
      state.isLogin = true;
    },
    logout: (state) => {
      state.email = '';
      state.password = '';
      state.isLogin = false;
      state.user = null;
      state.isAdmin = false;
      
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('is_admin');
      localStorage.removeItem('user_email');
    },
    
    syncWithStorage: (state) => {
      const hasToken = !!localStorage.getItem('access_token');
      const isAdmin = localStorage.getItem('is_admin') === 'true';
      const userEmail = localStorage.getItem('user_email') || '';
      
      state.isLogin = hasToken;
      state.isAdmin = isAdmin;
      state.email = userEmail;
    }
  }
});

export const { login, logout, adminlogin, refreshTokens, syncWithStorage } = LoginSlice.actions;
export default LoginSlice.reducer;