// src/hooks/useCompanyDetails.ts
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/store";
import {
  fetchCompanyOverview,
  fetchCompanyTaxes,
  fetchCompanyStocks,
  fetchCompanySalaries,
  fetchCompanyReviews,
  selectCompanyOverview,
  selectCompanyTaxes,
  selectCompanyStocks,
  selectCompanySalaries,
  selectCompanyReviews,
  selectCompanyLoadingState,
  selectCompanyErrorState,
  clearCompanyDetails,
  clearCachedSalaries,
  clearCachedReviews,
} from "@/features/companyDetails/companyDetailsSlice";
import {
  FetchSalariesParams,
  FetchReviewsParams,
  ExperienceFilter,
} from "@/features/companyDetails/types";
import { useCallback, useMemo } from "react";

export const useCompanyDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const overview = useSelector(selectCompanyOverview);
  const taxes = useSelector(selectCompanyTaxes);
  const stocks = useSelector(selectCompanyStocks);
  const loading = useSelector(selectCompanyLoadingState);
  const error = useSelector(selectCompanyErrorState);

  // Basic fetch methods
  const fetchOverview = useCallback(
    (companyId: string) => {
      return dispatch(fetchCompanyOverview(companyId));
    },
    [dispatch]
  );

  const fetchTaxes = useCallback(
    (companyId: string) => {
      return dispatch(fetchCompanyTaxes(companyId));
    },
    [dispatch]
  );

  const fetchStocks = useCallback(
    (companyId: string) => {
      return dispatch(fetchCompanyStocks(companyId));
    },
    [dispatch]
  );

  // New methods for salaries and reviews with caching
  const fetchSalaries = useCallback(
    (params: FetchSalariesParams) => {
      return dispatch(fetchCompanySalaries(params));
    },
    [dispatch]
  );

  const fetchReviews = useCallback(
    (params: FetchReviewsParams) => {
      return dispatch(fetchCompanyReviews(params));
    },
    [dispatch]
  );

  // Methods to get cached data
  const getSalaries = useCallback((params: FetchSalariesParams) => {
    return useSelector(selectCompanySalaries(params));
  }, []);

  const getReviews = useCallback((params: FetchReviewsParams) => {
    return useSelector(selectCompanyReviews(params));
  }, []);

  // Clear methods
  const clearDetails = useCallback(() => {
    dispatch(clearCompanyDetails());
  }, [dispatch]);

  const clearSalariesCache = useCallback(() => {
    dispatch(clearCachedSalaries());
  }, [dispatch]);

  const clearReviewsCache = useCallback(() => {
    dispatch(clearCachedReviews());
  }, [dispatch]);

  return {
    // Data
    overview,
    taxes,
    stocks,
    loading,
    error,

    // Fetch methods
    fetchOverview,
    fetchTaxes,
    fetchStocks,
    fetchSalaries,
    fetchReviews,

    // Data access methods
    getSalaries,
    getReviews,

    // Clear methods
    clearDetails,
    clearSalariesCache,
    clearReviewsCache,
  };
};
