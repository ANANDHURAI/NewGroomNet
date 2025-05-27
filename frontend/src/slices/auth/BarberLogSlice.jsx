import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  email: '',
  password: '',
  isBarberLogin: false
}

const barberLoginSlice = createSlice({
  name: 'barberLoginSlice',
  initialState,
  reducers: {
    barberlogin: (state, action) => {
      state.email = action.payload.email
      state.password = action.payload.password
      state.isBarberLogin = true
    }
  }
})

export const { barberlogin } = barberLoginSlice.actions
export default barberLoginSlice.reducer
