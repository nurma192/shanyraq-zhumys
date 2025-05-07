// src/app/providers.tsx
'use client';

import { useEffect } from 'react';
import { store, AppDispatch } from "@/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/toaster";
import { useDispatch } from 'react-redux';
import { initializeAuth } from '@/features/auth/authSlice';

// Create a typed dispatch hook
const useAppDispatch = () => useDispatch<AppDispatch>();

function AuthInitializer({ children }: { children: React.ReactNode }) {
  // Use the typed dispatch hook instead of useDispatch directly
  const dispatch = useAppDispatch();
  
  useEffect(() => {
    // Now TypeScript knows this is an async thunk action
    dispatch(initializeAuth());
  }, [dispatch]);
  
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthInitializer>
        {children}
        <Toaster />
      </AuthInitializer>
    </Provider>
  );
}