import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import salaryAPI from "./salaryAPI";

interface Salary {
  id: number;
  companyId: number;
  jobId: number;
  locationId: number | null;
  companyName: string;
  position: string;
  department: string;
  employmentStatus: string;
  employmentType: string;
  salary: number;
  currency: string;
  payPeriod: string;
  formattedAmount: string;
  bonuses: string;
  stockOptions: string;
  experience: string;
  location: string;
  anonymous: boolean;
  approvalStatus: string;
  hasVerification: boolean;
  contractDocumentUrl: string | null;
  date: string;
  adminComment?: string;
}

interface SalaryState {
  userSalaries: Salary[];
  allSalaries: Salary[];
  currentSalary: Salary | null;
  isLoading: boolean;
  error: string | null;
  userSalariesLoaded: boolean;
  allSalariesLoaded: boolean;
}

const initialState: SalaryState = {
  userSalaries: [],
  allSalaries: [],
  currentSalary: null,
  isLoading: false,
  error: null,
  userSalariesLoaded: false,
  allSalariesLoaded: false,
};

export const fetchUserSalaries = createAsyncThunk(
  "salary/fetchUserSalaries",
  async (_, { rejectWithValue }) => {
    try {
      const response = await salaryAPI.getUserSalaries();
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user salaries"
      );
    }
  }
);

export const fetchAllSalaries = createAsyncThunk(
  "salary/fetchAllSalaries",
  async (status: string | undefined, { rejectWithValue }) => {
    try {
      const response = await salaryAPI.getAllSalaries(status);
      return response.data || [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all salaries"
      );
    }
  }
);

export const fetchSalaryById = createAsyncThunk(
  "salary/fetchSalaryById",
  async (salaryId: string, { rejectWithValue }) => {
    try {
      const response = await salaryAPI.getSalary(salaryId);
      return response.data || null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch salary"
      );
    }
  }
);

export const deleteSalary = createAsyncThunk(
  "salary/deleteSalary",
  async (salaryId: string, { rejectWithValue }) => {
    try {
      await salaryAPI.deleteSalary(salaryId);
      return salaryId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete salary"
      );
    }
  }
);

export const updateSalaryStatus = createAsyncThunk(
  "salary/updateSalaryStatus",
  async (
    {
      salaryId,
      data,
    }: { salaryId: string; data: { status: string; adminComment?: string } },
    { rejectWithValue }
  ) => {
    try {
      const response = await salaryAPI.updateSalaryStatus(salaryId, data);
      return response.data || null;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update salary status"
      );
    }
  }
);

const salarySlice = createSlice({
  name: "salary",
  initialState,
  reducers: {
    clearCurrentSalary: (state) => {
      state.currentSalary = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSalaries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserSalaries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userSalaries = action.payload;
        state.userSalariesLoaded = true;
      })
      .addCase(fetchUserSalaries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchAllSalaries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllSalaries.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allSalaries = action.payload;
        state.allSalariesLoaded = true;
      })
      .addCase(fetchAllSalaries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(fetchSalaryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalaryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentSalary = action.payload;
      })
      .addCase(fetchSalaryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteSalary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteSalary.fulfilled, (state, action) => {
        state.isLoading = false;
        // Remove the deleted salary from both user and all salaries arrays
        state.userSalaries = state.userSalaries.filter(
          (salary) => salary.id.toString() !== action.payload
        );
        state.allSalaries = state.allSalaries.filter(
          (salary) => salary.id.toString() !== action.payload
        );
      })
      .addCase(deleteSalary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      .addCase(updateSalaryStatus.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateSalaryStatus.fulfilled, (state, action) => {
        state.isLoading = false;

        if (action.payload) {
          const updatedSalary = action.payload;

          // Update in allSalaries if present
          const index = state.allSalaries.findIndex(
            (salary) => salary.id === updatedSalary.id
          );
          if (index !== -1) {
            state.allSalaries[index] = updatedSalary;
          }

          // Update in userSalaries if present
          const userIndex = state.userSalaries.findIndex(
            (salary) => salary.id === updatedSalary.id
          );
          if (userIndex !== -1) {
            state.userSalaries[userIndex] = updatedSalary;
          }

          // Update currentSalary if it's the same one
          if (
            state.currentSalary &&
            state.currentSalary.id === updatedSalary.id
          ) {
            state.currentSalary = updatedSalary;
          }
        }
      })
      .addCase(updateSalaryStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentSalary } = salarySlice.actions;

export default salarySlice.reducer;
