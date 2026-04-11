import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import { getAllCustomers, blockCustomer, deleteCustomer } from '../services/adminService';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCustomers = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await getAllCustomers();
      setCustomers(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load customers.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleBlock = async (id) => {
    try {
      await blockCustomer(id);
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update customer status.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete customer.');
    }
  };

  const renderStatus = (customer) => {
    if (customer.isBlocked) return <span className="badge bg-danger">Blocked</span>;
    if (customer.active === false) return <span className="badge bg-secondary">Inactive</span>;
    return <span className="badge bg-success">Active</span>;
  };

  return (
    <AdminLayout>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
        <div>
          <h1 className="h3 fw-bold">Customer Management</h1>
          <p className="text-secondary mb-0">View and manage registered customers.</p>
        </div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded-4 p-3">
          <Table hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Created</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4 text-muted">
                    No customers found.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id || customer.customerId}>
                    <td>{customer.name || customer.fullName || 'N/A'}</td>
                    <td>{customer.email || 'N/A'}</td>
                    <td>{customer.phone || customer.mobile || 'N/A'}</td>
                    <td>{renderStatus(customer)}</td>
                    <td>{new Date(customer.createdAt || customer.createdDate || Date.now()).toLocaleDateString()}</td>
                    <td className="text-end">
                      <Button
                        size="sm"
                        variant={customer.isBlocked ? 'success' : 'warning'}
                        className="me-2"
                        onClick={() => handleBlock(customer.id || customer.customerId)}
                      >
                        {customer.isBlocked ? 'Unblock' : 'Block'}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(customer.id || customer.customerId)}
                      >
                        Delete
                      </Button>
                    </td>
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

export default AdminCustomers;
