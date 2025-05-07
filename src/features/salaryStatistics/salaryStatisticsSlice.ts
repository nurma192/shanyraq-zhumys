// src/features/salaryStatistics/salaryStatisticsSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "@/services/apiClient";
import { RootState } from "@/store";
import { SalaryStatisticsState } from "./types";

const initialState: SalaryStatisticsState = {
  data: {},
  loading: false,
  error: null,
};

export const fetchSalaryStatistics = createAsyncThunk(
  "salaryStatistics/fetch",
  async ({ jobId, locationId }: { jobId: string; locationId: string }, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/salary-statistics?jobId=${jobId}&locationId=${locationId}`);
      return { key: `${jobId}-${locationId}`, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch salary statistics");
    }
  }
);

const salaryStatisticsSlice = createSlice({
  name: "salaryStatistics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSalaryStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalaryStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.data[action.payload.key] = action.payload.data;
      })
      .addCase(fetchSalaryStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectSalaryStatistics = (jobId: string, locationId: string) => (state: RootState) => 
  state.salaryStatistics.data[`${jobId}-${locationId}`];

export const selectSalaryStatisticsLoading = (state: RootState) => state.salaryStatistics.loading;
export const selectSalaryStatisticsError = (state: RootState) => state.salaryStatistics.error;

export default salaryStatisticsSlice.reducer;