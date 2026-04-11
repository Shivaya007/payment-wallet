import React, { useState, useEffect } from 'react';
import { Table, Spinner, Form, Button, Row, Col, Card } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import { getAllTransactions } from '../services/adminService';

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', type: '' });

  const loadTransactions = async (params = {}) => {
    setLoading(true);
    try {
      const res = await getAllTransactions(params);
      setTransactions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadTransactions({ ...filters });
  };

  const handleReset = () => {
    const resetFilters = { search: '', type: '' };
    setFilters(resetFilters);
    loadTransactions(resetFilters);
  };

  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="h3 fw-bold">Transaction History</h1>
        <p className="text-secondary mb-0">Filter and review all transactions made across the system.</p>
      </div>

      <Card className="shadow-sm rounded-4 bg-white border-0 mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="g-3 align-items-end">
              <Col md={5}>
                <Form.Group>
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleChange}
                    placeholder="Search by customer, wallet, or reference"
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Type</Form.Label>
                  <Form.Select name="type" value={filters.type} onChange={handleChange}>
                    <option value="">All</option>
                    <option value="CREDIT">Credit</option>
                    <option value="DEBIT">Debit</option>
                    <option value="TRANSFER">Transfer</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3} className="d-flex gap-2">
                <Button type="submit" variant="primary" className="w-100">
                  Apply
                </Button>
                <Button variant="outline-secondary" className="w-100" onClick={handleReset}>
                  Reset
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded-4 p-3">
          <Table hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Customer</th>
                <th>Wallet</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id || tx.transactionId}>
                    <td>{tx.transactionId || tx.id || 'N/A'}</td>
                    <td>{tx.customerName || tx.customerEmail || 'N/A'}</td>
                    <td>{tx.walletId || tx.walletNumber || 'N/A'}</td>
                    <td>${Number(tx.amount ?? 0).toFixed(2)}</td>
                    <td>{tx.type || tx.transactionType || 'N/A'}</td>
                    <td>{tx.status || tx.state || 'N/A'}</td>
                    <td>{new Date(tx.date || tx.createdAt || Date.now()).toLocaleString()}</td>
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

import { Card } from 'react-bootstrap';

export default AdminTransactions;
