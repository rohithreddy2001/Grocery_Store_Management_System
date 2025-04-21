import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ManageProduct from './components/ManageProduct';
import Order from './components/Order';

function App() {
  return (
    <BrowserRouter>
      <div className="container">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/manage-product" element={<ManageProduct />} />
          <Route path="/order" element={<Order />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;