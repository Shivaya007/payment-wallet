import React, { useEffect, useState } from 'react';
import { Card, Alert, Form, Row, Col, Table, Badge, Button } from 'react-bootstrap';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { getAllTransactions } from '../services/transactionService';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    from: '',
    to: ''
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await getAllTransactions();
        setTransactions(res.data || []);
        setFiltered(res.data || []);
      } catch {
        setError('Failed to load transactions.');
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleChange = e => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const applyFilter = () => {
    let data = [...transactions];

    if (filters.category) {
      data = data.filter(tx => tx.category === filters.category);
    }

    if (filters.subCategory) {
      data = data.filter(tx => tx.subCategory === filters.subCategory);
    }

    if (filters.from && filters.to) {
      data = data.filter(
        tx => tx.transactionDate >= filters.from && tx.transactionDate <= filters.to
      );
    }

    setFiltered(data);
  };

  const clearFilter = () => {
    setFilters({ category: '', subCategory: '', from: '', to: '' });
    setFiltered(transactions);
  };

  const categories = [...new Set(transactions.map(tx => tx.category).filter(Boolean))];
  const subCategories = [...new Set(transactions.map(tx => tx.subCategory).filter(Boolean))];

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  return (
    <Layout>
      <h4 className="fw-bold mb-4 text-primary">Transactions</h4>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* 🔹 Filters */}
      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body>
          <Row className="g-3 align-items-end">
            <Col md={3}>
              <Form.Label>Category</Form.Label>
              <Form.Select name="category" value={filters.category} onChange={handleChange}>
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md={3}>
              <Form.Label>Sub Category</Form.Label>
              <Form.Select name="subCategory" value={filters.subCategory} onChange={handleChange}>
                <option value="">All Sub Categories</option>
                {subCategories.map(sc => (
                  <option key={sc}>{sc}</option>
                ))}
              </Form.Select>
            </Col>

            <Col md={2}>
              <Form.Label>From</Form.Label>
              <Form.Control type="date" name="from" value={filters.from} onChange={handleChange} />
            </Col>

            <Col md={2}>
              <Form.Label>To</Form.Label>
              <Form.Control type="date" name="to" value={filters.to} onChange={handleChange} />
            </Col>

            <Col md={2} className="d-flex gap-2">
              <Button variant="primary" onClick={applyFilter}>
                Apply
              </Button>
              <Button variant="secondary" onClick={clearFilter}>
                Clear
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 🔹 Transactions Table */}
      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Type</th>
                <th>Status</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Sub Category</th>
      
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center text-muted py-4">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((tx, i) => (
                  <tr key={tx.transactionId}>
                    <td>{i + 1}</td>

                    <td>
                      <Badge bg={tx.transactionType === 'CREDIT' ? 'success' : 'danger'}>
                        {tx.transactionType}
                      </Badge>
                    </td>

                    <td>
                      <Badge bg="secondary">{tx.transactionStatus}</Badge>
                    </td>

                    <td
                      className={
                        tx.transactionType === 'CREDIT'
                          ? 'text-success fw-semibold'
                          : 'text-danger fw-semibold'
                      }
                    >
                      {tx.transactionType === 'CREDIT' ? '+' : '-'}₹{tx.transactionAmount}
                    </td>

                    <td>{tx.category || '—'}</td>
                    <td>{tx.subCategory || '—'}</td>
                  
                    <td>{tx.transactionDate || '—'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default Transactions;