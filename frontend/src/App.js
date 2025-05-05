import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ManageProduct from './components/ManageProduct';
import Order from './components/Order';
import AdminPage from './components/AdminPage';

function App() {
  return (
    <AdminPage />
  );
}

export default App;