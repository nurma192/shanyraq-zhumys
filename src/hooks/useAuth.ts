// src/hooks/useAuth.ts
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import {
  login,
  logout,
  signup,
  verifyEmail,
  resetAuthState,
  updateUserProfile,
  initializeAuth,
  clearAuth,
} from "@/features/auth/authSlice";
import {
  LoginRequest,
  SignupRequest,
  VerifyEmailRequest,
  ProfileData, // Added import for ProfileData type
} from "@/features/auth/types";
import apiClient from "@/services/apiClient";
import { useRouter } from "next/navigation";
import { clearProfileData } from "@/features/profile/profileSlice";
import Cookies from "js-cookie";

// Define password update interface if not already defined in types
interface PasswordUpdateData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Simple tracker to prevent multiple initialization calls
let authInitialized = false;

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const initAuth = () => {
    if (!authInitialized) {
      authInitialized = true;
      return dispatch(initializeAuth());
    }
    return Promise.resolve();
  };

  const signupUser = (data: SignupRequest) => dispatch(signup(data));

  const verifyUserEmail = (data: VerifyEmailRequest) =>
    dispatch(verifyEmail(data));

  const loginUser = (data: LoginRequest) => dispatch(login(data));

  const logoutUser = async () => {
    await dispatch(logout());
    dispatch(clearProfileData());
    dispatch(clearAuth());

    // Ensure cookies are removed
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");

    return Promise.resolve();
  };

  const resetAuth = () => dispatch(resetAuthState());

  // Fixed the type for profileData parameter
  const updateProfile = (profileData: ProfileData) => {
    if (auth.isAuthenticated) {
      return dispatch(updateUserProfile(profileData));
    }
    return Promise.resolve();
  };

  // Fixed the type for passwordData parameter
  const updatePassword = async (passwordData: PasswordUpdateData) => {
    if (auth.isAuthenticated) {
      try {
        const response = await apiClient.post(
          "/profile/update-password",
          passwordData
        );
        return response.data;
      } catch (error) {
        throw error;
      }
    }
    return Promise.resolve();
  };

  return {
    ...auth,
    initAuth,
    signupUser,
    verifyUserEmail,
    loginUser,
    logoutUser,
    resetAuth,
    updateProfile,
    updatePassword,
  };
};

export default useAuth;