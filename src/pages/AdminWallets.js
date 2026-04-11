import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import { getAllWallets } from '../services/adminService';

const AdminWallets = () => {
  const [wallets, setWallets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWallets = async () => {
      try {
        const res = await getAllWallets();
        setWallets(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadWallets();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="h3 fw-bold">Wallet Management</h1>
        <p className="text-secondary mb-0">Review wallet balances and account status.</p>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded-4 p-3">
          <Table hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Wallet ID</th>
                <th>Customer</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {wallets.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No wallets found.
                  </td>
                </tr>
              ) : (
                wallets.map((wallet) => (
                  <tr key={wallet.id || wallet.walletId}>
                    <td>{wallet.walletId || wallet.id || 'N/A'}</td>
                    <td>{wallet.customerName || wallet.customerEmail || 'N/A'}</td>
                    <td>${Number(wallet.balance ?? 0).toFixed(2)}</td>
                    <td>
                      <span className={`badge ${wallet.active === false ? 'bg-secondary' : 'bg-success'}`}>
                        {wallet.active === false ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                    <td>{new Date(wallet.updatedAt || wallet.modifiedAt || Date.now()).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminWallets;
