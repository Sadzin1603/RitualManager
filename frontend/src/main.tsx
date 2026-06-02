import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider} from '@tanstack/react-query'
import { queryClient } from './lib/react-querty.js';
import App from './App.jsx'
import './index.css'
import {GoogleOAuthProvider} from '@react-oauth/google';

const CLIENT_ID = "375800896460-et18gm1ifoucvo0smghmrv36p3hi47c5.apps.googleusercontent.com"

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient} >
      <BrowserRouter>
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          <App />
        </GoogleOAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
)
