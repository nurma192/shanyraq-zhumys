// src/hooks/useProfile.ts
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { useAuth } from "./useAuth";
import {
  getProfile,
  updateProfile,
  updatePassword,
} from "@/features/profile/profileSlice";
import { ProfileData, PasswordUpdateData } from "@/features/auth/types";

// Track initialization to prevent multiple calls
let profileInitialized = false;

export const useProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated } = useAuth();
  const profileState = useSelector((state: RootState) => state.profile);

  const fetchProfile = async () => {
    if (isAuthenticated && !profileInitialized && !profileState.fetchedOnce) {
      profileInitialized = true;
      try {
        return await dispatch(getProfile()).unwrap();
      } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
      }
    }
    return Promise.resolve(profileState.data || user);
  };

  // Added proper type annotation for data parameter
  const updateUserProfile = async (data: ProfileData) => {
    try {
      const result = await dispatch(updateProfile(data)).unwrap();
      return result;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  // Added proper type annotation for data parameter
  const changePassword = async (data: PasswordUpdateData) => {
    try {
      const result = await dispatch(updatePassword(data)).unwrap();
      return result;
    } catch (error) {
      console.error("Error changing password:", error);
      throw error;
    }
  };

  return {
    data: profileState.data || user,
    isLoading: profileState.isLoading,
    error: profileState.error,
    isAuthenticated,
    fetchedOnce: profileState.fetchedOnce,
    fetchProfile,
    updateUserProfile,
    changePassword,
  };
};

export default useProfile;