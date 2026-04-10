import React from 'react';
import { NavLink } from 'react-router-dom';

const links = [
  { to: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
  { to: '/wallet', icon: 'bi-wallet2', label: 'Wallet' },
  { to: '/beneficiaries', icon: 'bi-people', label: 'Beneficiaries' },
  { to: '/bank-accounts', icon: 'bi-bank', label: 'Bank Accounts' },
  { to: '/transactions', icon: 'bi-arrow-left-right', label: 'Transactions' },
  { to: '/bills', icon: 'bi-receipt', label: 'Bill Payments' },
];

const Sidebar = () => (
  <div
    className="d-flex flex-column bg-white border-end shadow-sm"
    style={{ width: '220px', minHeight: '100vh', paddingTop: '1rem' }}
  >
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

export default Sidebar;
