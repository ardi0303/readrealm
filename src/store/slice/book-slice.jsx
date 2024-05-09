import { createSlice } from "@reduxjs/toolkit"
import { set } from "firebase/database"

const initialState = {
  searchBooks: "",
  idBooks: null,
  saveBooks: []
}

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    setSearchBooks: (state, action) => {
      state.searchBooks = action.payload
    },
    setIdBooks: (state, action) => {
      state.idBooks = action.payload
    },
    setSaveBooks: (state, action) => {
      state.saveBooks = action.payload
    }
  }
})

export const { setSearchBooks, setIdBooks, setSaveBooks } = bookSlice.actions
export default bookSlice.reducer