// store.js
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import bookSlice from "./slice/book-slice"; // Ubah path sesuai struktur proyek Anda
import botSlice from "./slice/bot-slice";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["searchBooks"], 
};

const rootReducer = combineReducers({
  books: persistReducer(persistConfig, bookSlice),
  bot: botSlice,
});


export const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
