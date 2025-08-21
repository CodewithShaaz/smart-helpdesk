import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import axios from 'axios';
import './index.css';

import Layout from './Layout.jsx'; // Import Layout
import HomePage from './pages/HomePage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import TicketListPage from './pages/TicketListPage.jsx';
import NewTicketPage from './pages/NewTicketPage.jsx'; 
import TicketDetailPage from './pages/TicketDetailPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

// Configure Axios Base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />, // Use Layout as the main element
    children: [
      { index: true, element: <HomePage /> }, // index:true makes this the default child
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'tickets', element: <TicketListPage /> },
      { path: 'tickets/new', element: <NewTicketPage /> },
      { path: 'tickets/:id', element: <TicketDetailPage /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);