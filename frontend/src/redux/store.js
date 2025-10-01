import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/AuthSlice";
import booksSlice from "./slices/booksSlice";
import usersSlice from "./slices/usersSlice";
import borrowRequestsSlice from "./slices/borrowRequestSlice";

const store = configureStore({
  reducer: {
    auth: authSlice,
    books: booksSlice,
    users: usersSlice,
    borrowRequests: borrowRequestsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: ["persist/PERSIST"],
      },
    }),
});

export default store;
