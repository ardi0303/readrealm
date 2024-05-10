import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  message: [
    {
      text: "Hello, how can I help you?",
      isBot: true,
    },
  ],
}

const botSlice = createSlice({
  name: "bot",
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload
    },
  }
})

export const { setMessage } = botSlice.actions
export default botSlice.reducer