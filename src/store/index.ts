import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/features/auth/authSlice";
import profileReducer from "@/features/profile/profileSlice";
import reviewReducer from "@/features/review/reviewSlice";
import salaryReducer from "@/features/salary/salarySlice";
import companyReducer from "@/features/company/companySlice";
import companyDetailsReducer from "@/features/companyDetails/companyDetailsSlice";
import salaryStatisticsReducer from "@/features/salaryStatistics/salaryStatisticsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    profile: profileReducer,
    review: reviewReducer,
    salary: salaryReducer,
    company: companyReducer,
    companyDetails: companyDetailsReducer,
    salaryStatistics: salaryStatisticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
