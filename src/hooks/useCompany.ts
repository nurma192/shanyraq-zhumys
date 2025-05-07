// src/hooks/useCompany.ts
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch,RootState } from "@/store";
import {
  fetchCompanies,
  fetchCompanyById,
  setFilters,
  resetFilters,
  selectCompanies,
  selectCompanyDetails,
  selectFilters,
  selectPagination,
  selectLoading,
  selectError,
  selectLastFetchedAt,
} from "@/features/company/companySlice";
import { CompanyListParams } from "@/features/company/types";
import { useEffect, useCallback, useState } from "react";

export const useCompany = () => {
  const dispatch = useDispatch<AppDispatch>();
  const companies = useSelector(selectCompanies);
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const lastFetchedAt = useSelector(selectLastFetchedAt);

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const getCompanies = useCallback(
    (params?: CompanyListParams) => {
      return dispatch(fetchCompanies(params || {}));
    },
    [dispatch]
  );

  const getCompanyById = useCallback(
    (id: string) => {
      return dispatch(fetchCompanyById(id));
    },
    [dispatch]
  );

  const updateFilters = useCallback(
    (newFilters: CompanyListParams) => {
      dispatch(setFilters(newFilters));
      // Reset to page 0 when filters change
      return dispatch(fetchCompanies({ ...newFilters, page: 0 }));
    },
    [dispatch]
  );

  const resetAllFilters = useCallback(() => {
    dispatch(resetFilters());
    return dispatch(fetchCompanies({ page: 0 }));
  }, [dispatch]);

  // Function to get company details either from store or API
  const getCompanyDetails = useCallback((id: string) => {
    const selectCompany = selectCompanyDetails(id);
    return (state: RootState) => {
      const company = selectCompany(state);
      if (company) return company;
      return null;
    };
  }, []);

  // Initial fetch on component mount if not already loaded - FIX HERE
  useEffect(() => {
    if (!initialLoadDone && !lastFetchedAt) {
      getCompanies();
      setInitialLoadDone(true);
    }
  }, [getCompanies, initialLoadDone, lastFetchedAt]);

  return {
    companies: companies || [], // Ensure companies is never undefined
    filters,
    pagination,
    loading,
    error,
    getCompanies,
    getCompanyById,
    updateFilters,
    resetAllFilters,
    getCompanyDetails,
  };
};