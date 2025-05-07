// src/features/review/reviewSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import reviewAPI from "./reviewAPI";

interface Review {
  id: number;
  companyName: string;
  title: string;
  body: string;
  pros: string;
  cons: string;
  advice: string;
  rating: number;
  careerOpportunities: number;
  workLifeBalance: number;
  compensation: number;
  jobSecurity: number;
  management: number;
  position: string;
  employmentStatus: string;
  employmentType: string;
  recommendToFriend: boolean;
  anonymous: boolean;
  helpfulCount: number;
  notHelpfulCount: number;
  commentsCount: number;
  author: string | null;
  approvalStatus: string;
  hasVerification: boolean;
  contractDocumentUrl: string | null;
  date: string;
  status: string;
  hasAdminComment: boolean;
  verified: boolean | null;
  adminComment: string | null;
  aiAnalysis: string;
}

interface ReviewState {
  userReviews: Review[];
  allReviews: Review[];
  currentReview: Review | null;
  isLoading: boolean;
  error: string | null;
  userReviewsLoaded: boolean; // New flag
  allReviewsLoaded: boolean; // New flag
}

const initialState: ReviewState = {
  userReviews: [],
  allReviews: [],
  currentReview: null,
  isLoading: false,
  error: null,
  userReviewsLoaded: false,
  allReviewsLoaded: false,
};

export const fetchUserReviews = createAsyncThunk(
  "review/fetchUserReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getUserReviews();
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user reviews"
      );
    }
  }
);

export const fetchAllReviews = createAsyncThunk(
  "review/fetchAllReviews",
  async (status: string | undefined, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getAllReviews(status);
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all reviews"
      );
    }
  }
);

export const fetchReviewById = createAsyncThunk(
  "review/fetchReviewById",
  async (reviewId: string, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getReview(reviewId);
      return response.data || null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch review"
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (reviewId: string, { rejectWithValue }) => {
    try {
      await reviewAPI.deleteReview(reviewId);
      return reviewId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

export const updateReviewStatus = createAsyncThunk(
  "review/updateReviewStatus",
  async (
    {
      reviewId,
      data,
    }: { reviewId: string; data: { status: string; adminComment?: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await reviewAPI.updateReviewStatus(reviewId, data);
      return response.data || null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update review status"
      );
    }
  }
);

const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userReviews = action.payload;
        state.userReviewsLoaded = true;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllReviews.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allReviews = action.payload;
        state.allReviewsLoaded = true;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchReviewById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentReview = action.payload;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteReview.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userReviews = state.userReviews.filter(
          (review) => review.id.toString() !== action.payload
        );
        state.allReviews = state.allReviews.filter(
          (review) => review.id.toString() !== action.payload
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateReviewStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateReviewStatus.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload) {
          const updatedReview = action.payload;

          const index = state.allReviews.findIndex(
            (review) => review.id === updatedReview.id
          );
          if (index !== -1) {
            state.allReviews[index] = updatedReview;
          }

          const userIndex = state.userReviews.findIndex(
            (review) => review.id === updatedReview.id
          );
          if (userIndex !== -1) {
            state.userReviews[userIndex] = updatedReview;
          }

          if (
            state.currentReview &&
            state.currentReview.id === updatedReview.id
          ) {
            state.currentReview = updatedReview;
          }
        }
      })
      .addCase(updateReviewStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentReview } = reviewSlice.actions;

export default reviewSlice.reducer;
