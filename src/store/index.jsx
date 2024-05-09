// store.js
import { configureStore } from "@reduxjs/toolkit";
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

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["searchBooks"], 
};

const persistedReducer = persistReducer(persistConfig, bookSlice);

export const store = configureStore({
  reducer: {
    books: persistedReducer, // Gunakan reducer yang telah di-persist
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
