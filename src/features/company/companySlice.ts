// src/features/company/companySlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { companyAPI } from "./companyAPI";
import { CompanyListParams, CompanyListResponse, ICompany } from "./types";
import { RootState } from "@/store";

interface CompanyState {
  companies: ICompany[];
  companyDetails: Record<string, ICompany>;
  filters: CompanyListParams;
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  lastFetchedAt: number | null;
}

const initialState: CompanyState = {
  companies: [],
  companyDetails: {},
  filters: {
    search: "",
    location: "",
    industry: "",
    minRating: undefined,
    size: "",
    page: 0,
    pageSize: 10,
  },
  pageNumber: 0,
  pageSize: 10,
  totalElements: 0,
  totalPages: 0,
  loading: false,
  error: null,
  lastFetchedAt: null,
};

export const fetchCompanies = createAsyncThunk(
  "company/fetchCompanies",
  async (params: CompanyListParams, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const { filters } = state.company;

      const mergedParams = { ...filters, ...params };

      const response = await companyAPI.getCompanies(mergedParams);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchCompanyById = createAsyncThunk(
  "company/fetchCompanyById",
  async (id: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as RootState;
      const existingCompany = state.company.companyDetails[id];

      if (existingCompany && existingCompany.overallInfo) {
        return existingCompany;
      }

      const response = await companyAPI.getCompanyById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<CompanyListParams>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCompanies: (state) => {
      state.companies = [];
      state.pageNumber = 0;
      state.totalElements = 0;
      state.totalPages = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompanies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.loading = false;
        state.companies = action.payload.data.content;
        state.pageNumber = action.payload.data.pageNumber;
        state.pageSize = action.payload.data.pageSize;
        state.totalElements = action.payload.data.totalElements;
        state.totalPages = action.payload.data.totalPages;
        state.lastFetchedAt = Date.now();

        if (action.meta.arg) {
          state.filters = { ...state.filters, ...action.meta.arg };
        }
      })
      .addCase(fetchCompanies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCompanyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompanyById.fulfilled, (state, action) => {
        state.loading = false;
        state.companyDetails[action.payload.id] = action.payload;
      })
      .addCase(fetchCompanyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, resetFilters, clearCompanies } =
  companySlice.actions;

export const selectCompanies = (state: RootState) => state.company.companies;
export const selectCompanyDetails = (id: string) => (state: RootState) =>
  state.company.companyDetails[id];
export const selectFilters = (state: RootState) => state.company.filters;
export const selectPagination = (state: RootState) => ({
  pageNumber: state.company.pageNumber,
  pageSize: state.company.pageSize,
  totalElements: state.company.totalElements,
  totalPages: state.company.totalPages,
});
export const selectLoading = (state: RootState) => state.company.loading;
export const selectError = (state: RootState) => state.company.error;
export const selectLastFetchedAt = (state: RootState) =>
  state.company.lastFetchedAt;

export default companySlice.reducer;
