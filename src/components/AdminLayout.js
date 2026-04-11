import React from 'react';
import AppNavbar from './Navbar';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => (
  <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
    <AppNavbar />
    <div className="d-flex flex-grow-1">
      <AdminSidebar />
      <main className="flex-grow-1 p-4 bg-light">{children}</main>
    </div>
  </div>
);

export default AdminLayout;
