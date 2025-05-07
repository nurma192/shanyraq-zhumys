// src/features/companyDetails/companyDetailsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import companyDetailsAPI from "./companyDetailsAPI";
import { RootState } from "@/store";
import {
  CompanyDetailsState,
  FetchSalariesParams,
  FetchReviewsParams,
  ExperienceFilter,
} from "./types";

// Helper function to create cache keys
const createCacheKey = (params: Record<string, any>): string => {
  const sortedEntries = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .sort(([keyA], [keyB]) => keyA.localeCompare(keyB));

  return sortedEntries.map(([key, value]) => `${key}:${value}`).join("|");
};

// Initial state
const initialState: CompanyDetailsState = {
  overview: null,
  taxes: null,
  stocks: null,
  reviews: {},
  salaries: {},
  loading: {
    overview: false,
    taxes: false,
    stocks: false,
    reviews: false,
    salaries: false,
  },
  error: {
    overview: null,
    taxes: null,
    stocks: null,
    reviews: null,
    salaries: null,
  },
};

// Async thunks
export const fetchCompanyOverview = createAsyncThunk(
  "companyDetails/fetchOverview",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await companyDetailsAPI.getCompanyOverview(companyId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company overview"
      );
    }
  }
);

export const fetchCompanyTaxes = createAsyncThunk(
  "companyDetails/fetchTaxes",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await companyDetailsAPI.getCompanyTaxes(companyId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company taxes"
      );
    }
  }
);

export const fetchCompanyStocks = createAsyncThunk(
  "companyDetails/fetchStocks",
  async (companyId: string, { rejectWithValue }) => {
    try {
      const response = await companyDetailsAPI.getCompanyStocks(companyId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company stocks"
      );
    }
  }
);

// New async thunks for salaries and reviews
export const fetchCompanySalaries = createAsyncThunk(
  "companyDetails/fetchSalaries",
  async (params: FetchSalariesParams, { getState, rejectWithValue }) => {
    try {
      // Create a cache key for these parameters
      const cacheKey = createCacheKey(params);
      const state = getState() as RootState;

      // Check if we already have this data cached
      const cachedData = state.companyDetails.salaries[cacheKey];

      // If data is cached and not specifically requesting a refresh, return it
      if (cachedData) {
        return { data: cachedData, cacheKey };
      }

      // Otherwise fetch new data
      const response = await companyDetailsAPI.getCompanySalaries(params);
      return { data: response.data, cacheKey };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company salaries"
      );
    }
  }
);

export const fetchCompanyReviews = createAsyncThunk(
  "companyDetails/fetchReviews",
  async (params: FetchReviewsParams, { getState, rejectWithValue }) => {
    try {
      // Create a cache key for these parameters
      const cacheKey = createCacheKey(params);
      const state = getState() as RootState;

      // Check if we already have this data cached
      const cachedData = state.companyDetails.reviews[cacheKey];

      // If data is cached and not specifically requesting a refresh, return it
      if (cachedData) {
        return { data: cachedData, cacheKey };
      }

      // Otherwise fetch new data
      const response = await companyDetailsAPI.getCompanyReviews(params);
      return { data: response.data, cacheKey };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch company reviews"
      );
    }
  }
);

// Create slice
const companyDetailsSlice = createSlice({
  name: "companyDetails",
  initialState,
  reducers: {
    clearCompanyDetails: (state) => {
      return initialState;
    },
    // Add a reducer to clear specific cached data if needed
    clearCachedSalaries: (state) => {
      state.salaries = {};
    },
    clearCachedReviews: (state) => {
      state.reviews = {};
    },
  },
  extraReducers: (builder) => {
    // Overview
    builder
      .addCase(fetchCompanyOverview.pending, (state) => {
        state.loading.overview = true;
        state.error.overview = null;
      })
      .addCase(fetchCompanyOverview.fulfilled, (state, action) => {
        state.loading.overview = false;
        state.overview = action.payload;
      })
      .addCase(fetchCompanyOverview.rejected, (state, action) => {
        state.loading.overview = false;
        state.error.overview = action.payload as string;
      });

    // Taxes
    builder
      .addCase(fetchCompanyTaxes.pending, (state) => {
        state.loading.taxes = true;
        state.error.taxes = null;
      })
      .addCase(fetchCompanyTaxes.fulfilled, (state, action) => {
        state.loading.taxes = false;
        state.taxes = action.payload;
      })
      .addCase(fetchCompanyTaxes.rejected, (state, action) => {
        state.loading.taxes = false;
        state.error.taxes = action.payload as string;
      });

    // Stocks
    builder
      .addCase(fetchCompanyStocks.pending, (state) => {
        state.loading.stocks = true;
        state.error.stocks = null;
      })
      .addCase(fetchCompanyStocks.fulfilled, (state, action) => {
        state.loading.stocks = false;
        state.stocks = action.payload;
      })
      .addCase(fetchCompanyStocks.rejected, (state, action) => {
        state.loading.stocks = false;
        state.error.stocks = action.payload as string;
      });

    // Salaries with caching
    builder
      .addCase(fetchCompanySalaries.pending, (state) => {
        state.loading.salaries = true;
        state.error.salaries = null;
      })
      .addCase(fetchCompanySalaries.fulfilled, (state, action) => {
        state.loading.salaries = false;
        // Store data with the cache key
        state.salaries[action.payload.cacheKey] = action.payload.data;
      })
      .addCase(fetchCompanySalaries.rejected, (state, action) => {
        state.loading.salaries = false;
        state.error.salaries = action.payload as string;
      });

    // Reviews with caching
    builder
      .addCase(fetchCompanyReviews.pending, (state) => {
        state.loading.reviews = true;
        state.error.reviews = null;
      })
      .addCase(fetchCompanyReviews.fulfilled, (state, action) => {
        state.loading.reviews = false;
        // Store data with the cache key
        state.reviews[action.payload.cacheKey] = action.payload.data;
      })
      .addCase(fetchCompanyReviews.rejected, (state, action) => {
        state.loading.reviews = false;
        state.error.reviews = action.payload as string;
      });
  },
});

// Actions
export const { clearCompanyDetails, clearCachedSalaries, clearCachedReviews } =
  companyDetailsSlice.actions;

// Selectors
export const selectCompanyOverview = (state: RootState) =>
  state.companyDetails.overview;

export const selectCompanyTaxes = (state: RootState) =>
  state.companyDetails.taxes;

export const selectCompanyStocks = (state: RootState) =>
  state.companyDetails.stocks;

export const selectCompanyLoadingState = (state: RootState) =>
  state.companyDetails.loading;

export const selectCompanyErrorState = (state: RootState) =>
  state.companyDetails.error;

// New selectors with parameter-based lookup
export const selectCompanySalaries =
  (params: FetchSalariesParams) => (state: RootState) => {
    const cacheKey = createCacheKey(params);
    return state.companyDetails.salaries[cacheKey];
  };

export const selectCompanyReviews =
  (params: FetchReviewsParams) => (state: RootState) => {
    const cacheKey = createCacheKey(params);
    return state.companyDetails.reviews[cacheKey];
  };

export default companyDetailsSlice.reducer;
