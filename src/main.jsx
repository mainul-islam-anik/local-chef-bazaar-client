import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import { RouterProvider } from 'react-router';
import { router } from './routers/Router';
import AuthProvider from './contexts/AuthContext/AuthProvider';
import { Toaster } from 'react-hot-toast';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    
      <AuthProvider>
            <RouterProvider router={router} />,
            <Toaster position="top-center" />
      </AuthProvider>
    
  </StrictMode>,
)
