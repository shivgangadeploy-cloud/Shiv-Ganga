// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="flex">
      {/* Sidebar stays fixed here */}
      <Sidebar />
      
      {/* The main content changes here based on the URL */}
      <div className="flex-1 h-screen overflow-y-auto bg-gray-100 p-8">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Layout;