import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { StackProvider } from '@stackframe/react';
import { QueryClient, QueryClientProvider, } from '@tanstack/react-query';
import { stackClientApp } from "./lib/stack-auth.ts";

import './index.css';
import App from './App.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <StackProvider app={stackClientApp}>
          <App />
        </StackProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
