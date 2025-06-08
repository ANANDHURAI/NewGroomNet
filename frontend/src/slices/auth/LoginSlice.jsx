import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  user: null,
  user_type: '',
  tokens: {
    access: null,
    refresh: null
  }
};

const LoginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {

    login: (state, action) => {
      const { user, access, refresh } = action.payload;
      
      state.isLogin = true;
      state.user = user;
      state.user_type = user.user_type;
      state.tokens = { access, refresh };
      
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user_type', user.user_type);
      localStorage.setItem('user_data', JSON.stringify(user));
    },
    
    logout: (state) => {
      state.isLogin = false;
      state.user = null;
      state.user_type = '';
      state.tokens = { access: null, refresh: null };
      
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_type');
      localStorage.removeItem('user_data');
    }
  }
});

export const { login, logout } = LoginSlice.actions;
export default LoginSlice.reducer;