// import { useState } from 'react'

import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';
import MainLayout from './layouts/MainLayout'
import HeroIndex from './components/HeroIndex/HeroIndex';
import './App.css'

function App() {
  
  const router = createBrowserRouter(
    createRoutesFromElements(
    <Route path='/' element={<MainLayout/>}>
      <Route index element={<HeroIndex/>}></Route>
      <Route path="/login" element={<></>}></Route>

    </Route>)
  )
  return <RouterProvider router={router}></RouterProvider>
}

export default App;
