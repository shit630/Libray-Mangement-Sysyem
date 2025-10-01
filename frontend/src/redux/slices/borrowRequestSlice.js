import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";

// Thunks
export const createBorrowRequest = createAsyncThunk(
  "borrowRequests/createBorrowRequest",
  async ({ bookId, expectedReturnDate }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/borrow-requests/${bookId}`, {
        expectedReturnDate,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create borrow request"
      );
    }
  }
);

export const getBorrowRequests = createAsyncThunk(
  "borrowRequests/getBorrowRequests",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/borrow-requests", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch borrow requests"
      );
    }
  }
);

export const getMyBorrowRequests = createAsyncThunk(
  "borrowRequests/getMyBorrowRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/borrow-requests/my-requests");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch your borrow requests"
      );
    }
  }
);

export const updateBorrowRequest = createAsyncThunk(
  "borrowRequests/updateBorrowRequest",
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/borrow-requests/${id}`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update borrow request"
      );
    }
  }
);

export const cancelBorrowRequest = createAsyncThunk(
  "borrowRequests/cancelBorrowRequest",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/borrow-requests/${id}/cancel`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel borrow request"
      );
    }
  }
);

export const returnBorrowBook = createAsyncThunk(
  "borrowRequests/returnBorrowBook",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/borrow-requests/${id}/return`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to return book"
      );
    }
  }
);

// Initial State
const initialState = {
  borrowRequests: [],
  myBorrowRequests: [],
  isLoading: false,
  error: null,
  pagination: {
    totalBorrowReq: 0,
    totalPages: 0,
    currentPage: 1,
  },
};

// Slice
const borrowRequestsSlice = createSlice({
  name: "borrowRequests",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder
      // Create Borrow Request
      .addCase(createBorrowRequest.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createBorrowRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload?.data) {
          // push into myBorrowRequests so UI updates instantly
          state.myBorrowRequests.unshift(action.payload.data);
        }
      })
      .addCase(createBorrowRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Borrow Requests (Admin/All)
      .addCase(getBorrowRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getBorrowRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.borrowRequests = action.payload.data || [];
        state.pagination = {
          totalBorrowReq: action.payload.totalBorrowReq || 0,
          totalPages: action.payload.totalPages || 0,
          currentPage:
            action.payload.currentPage || state.pagination.currentPage,
        };
      })
      .addCase(getBorrowRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get My Borrow Requests
      .addCase(getMyBorrowRequests.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMyBorrowRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myBorrowRequests = action.payload.data || [];
      })
      .addCase(getMyBorrowRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Borrow Request (Admin changes status)
      .addCase(updateBorrowRequest.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const updated = action.payload.data;
          // Update in borrowRequests
          const i1 = state.borrowRequests.findIndex(
            (req) => req._id === updated._id
          );
          if (i1 !== -1) state.borrowRequests[i1] = updated;
          // Update in myBorrowRequests also
          const i2 = state.myBorrowRequests.findIndex(
            (req) => req._id === updated._id
          );
          if (i2 !== -1) state.myBorrowRequests[i2] = updated;
        }
      })

      // Cancel Borrow Request
      .addCase(cancelBorrowRequest.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const updated = action.payload.data;
          const i = state.myBorrowRequests.findIndex(
            (req) => req._id === updated._id
          );
          if (i !== -1) state.myBorrowRequests[i] = updated;
        }
      })

      // Return Borrow Book
      .addCase(returnBorrowBook.fulfilled, (state, action) => {
        if (action.payload?.data) {
          const updated = action.payload.data;
          const i = state.myBorrowRequests.findIndex(
            (req) => req._id === updated._id
          );
          if (i !== -1) state.myBorrowRequests[i] = updated;
        }
      });
  },
});

export const { clearError, setCurrentPage } = borrowRequestsSlice.actions;
export default borrowRequestsSlice.reducer;
