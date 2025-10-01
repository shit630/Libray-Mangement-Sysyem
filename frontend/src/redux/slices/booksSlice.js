// src/redux/slices/booksSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/axiosConfig";

// ------------------- Async Thunks -------------------

export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/books", { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch books"
      );
    }
  }
);

export const fetchBook = createAsyncThunk(
  "books/fetchBook",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch book"
      );
    }
  }
);

export const createBook = createAsyncThunk(
  "books/createBook",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/books`, bookData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create book"
      );
    }
  }
);

export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ id, bookData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`/books/${id}`, bookData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update book"
      );
    }
  }
);

export const deleteBook = createAsyncThunk(
  "books/deleteBook",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/books/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete book"
      );
    }
  }
);

export const addReview = createAsyncThunk(
  "books/addReview",
  async ({ bookId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/books/${bookId}/reviews`,
        reviewData
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add review"
      );
    }
  }
);

export const addToFavorites = createAsyncThunk(
  "books/addToFavorites",
  async (bookId, { rejectWithValue }) => {
    try {
      await axiosInstance.post(`/users/favorites/${bookId}`);
      return { bookId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to favorites"
      );
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  "books/removeFromFavorites",
  async (bookId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/users/favorites/${bookId}`);
      return { bookId };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove from favorites"
      );
    }
  }
);

// ------------------- Slice -------------------

const initialState = {
  books: [],
  currentBook: null,
  isLoading: false,
  error: null,
  pagination: {
    totalPages: 0,
    totalBooks: 0,
    page: 1,
    limit: 10,
  },
};

const booksSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearCurrentBook: (state) => {
      state.currentBook = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // -------- Fetch Books --------
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.books = action.payload.data.map((book) => ({
          ...book,
          isFavorite: book.isFavorite ?? false,
        }));
        state.pagination.page = action.payload.page;
        state.pagination.totalPages = action.payload.totalPages;
        state.pagination.totalBooks = action.payload.totalBooks;
        state.pagination.limit = action.payload.limit;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // -------- Fetch single Book --------
      .addCase(fetchBook.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBook = {
          ...action.payload.data,
          isFavorite: action.payload.data.isFavorite ?? false,
        };
      })
      .addCase(fetchBook.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // -------- Create Book --------
      .addCase(createBook.fulfilled, (state, action) => {
        state.books.push(action.payload.data);
      })

      // -------- Update Book --------
      .addCase(updateBook.fulfilled, (state, action) => {
        const index = state.books.findIndex(
          (book) => book._id === action.payload.data._id
        );
        if (index !== -1) {
          state.books[index] = action.payload.data;
        }
        if (
          state.currentBook &&
          state.currentBook._id === action.payload.data._id
        ) {
          state.currentBook = action.payload.data;
        }
      })

      // -------- Delete Book --------
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.books = state.books.filter((book) => book._id !== action.payload);
      })

      // -------- Add to Favorites --------
      .addCase(addToFavorites.fulfilled, (state, action) => {
        const bookId = action.payload.bookId;
        const book = state.books.find((b) => b._id === bookId);
        if (book) book.isFavorite = true;
        if (state.currentBook && state.currentBook._id === bookId) {
          state.currentBook.isFavorite = true;
        }
      })

      // -------- Remove from Favorites --------
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        const bookId = action.payload.bookId;
        const book = state.books.find((b) => b._id === bookId);
        if (book) book.isFavorite = false;
        if (state.currentBook && state.currentBook._id === bookId) {
          state.currentBook.isFavorite = false;
        }
      })
      // -------- add review ---------
      .addCase(addReview.fulfilled, (state, action) => {
        if (state.currentBook) {
          state.currentBook.reviews.push(action.meta.arg.reviewData);
          // Optionally recalc ratings
          const total = state.currentBook.reviews.reduce(
            (acc, r) => acc + r.rating,
            0
          );
          state.currentBook.ratings = total / state.currentBook.reviews.length;
        }
      });
  },
});

export const { clearCurrentBook, clearError } = booksSlice.actions;
export default booksSlice.reducer;
