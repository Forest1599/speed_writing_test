// import { useState } from 'react'

import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import TypingTest from './components/Game/TypingTest';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';

// Will use this later
import ProtectedRoute from './Routes/ProtectedRoute';

import './App.css'
import RandomTest from './pages/RandomTest';
import AdaptiveTest from './pages/AdaptiveTest';
//import { AuthProvider } from './components/AuthContext';

// When the user tries to logout,
function Logout() {
  localStorage.clear();
  localStorage.setItem("successMessage", "Successfully logged out!") // To indicate that the user has logged out successfully
  return <Navigate to="/login"/>
}


function App() {
  
  // Use protected routes for routes that are required by login such as statistics and profile

  const router = createBrowserRouter(
    createRoutesFromElements(
    

      <Route path='/' element={<MainLayout/>}>
        <Route index element={
            <RandomTest/>
        }></Route>

        <Route path="/adaptive" element={
          <ProtectedRoute>
            <AdaptiveTest/>  
          </ProtectedRoute>
        }></Route>

        <Route path="/login" element={<Login/>}></Route>
        <Route path="/logout" element={<Logout/>} ></Route>
        <Route path="/register" element={<Register/>}></Route>
        
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile/>  
          </ProtectedRoute>
        }></Route>

        <Route path="*" element={<NotFound />}></Route>
      </Route>
    )
  )
  return (
    // <AuthProvider>
    <>
      <RouterProvider router={router}></RouterProvider>
    </>
  )
    // </AuthProvider>)
}

export default App;
