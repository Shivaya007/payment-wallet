import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/admin/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/admin/customers', icon: 'bi-people', label: 'Customers' },
  { to: '/admin/wallets', icon: 'bi-wallet2', label: 'Wallets' },
  { to: '/admin/transactions', icon: 'bi-arrow-left-right', label: 'Transactions' },
  { to: '/admin/beneficiaries', icon: 'bi-person-lines-fill', label: 'Beneficiaries' },
];

const AdminSidebar = () => (
  <div
    className="d-flex flex-column bg-white border-end shadow-sm"
    style={{ width: '240px', minHeight: '100vh', paddingTop: '1rem' }}
  >
    <div className="px-4 pb-3 mb-3 border-bottom">
      <div className="text-uppercase text-secondary fs-7 fw-semibold">Admin Panel</div>
    </div>
    {links.map(({ to, icon, label }) => (
      <NavLink
        key={to}
        to={to}
        className={({ isActive }) =>
          `d-flex align-items-center gap-2 px-4 py-3 text-decoration-none fw-medium ${
            isActive ? 'bg-primary text-white' : 'text-secondary'
          }`
        }
        style={{ fontSize: '0.95rem', transition: 'background 0.2s' }}
      >
        <i className={`bi ${icon}`}></i>
        {label}
      </NavLink>
    ))}
  </div>
);

export default AdminSidebar;
