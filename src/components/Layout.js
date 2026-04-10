import React from 'react';
import AppNavbar from './Navbar';
import Sidebar from './Sidebar';

const Layout = ({ children }) => (
  <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
    <AppNavbar />
    <div className="d-flex flex-grow-1">
      <Sidebar />
      <main className="flex-grow-1 p-4 bg-light">{children}</main>
    </div>
  </div>
);

export default Layout;
