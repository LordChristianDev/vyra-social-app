import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react'
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query';

import './index.css';
import App from './App.tsx';

export const BASE_URL = import.meta.env.MODE === "development"
  ? "http://localhost:4000/api"
  : "/api";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          <App />
        </ClerkProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode >,
);
