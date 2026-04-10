import React, { useEffect, useState } from 'react';
import { Card, Alert, Form, Row, Col, Table, Badge } from 'react-bootstrap';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { getAllTransactions } from '../services/transactionService';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ category: '', date: '', type: '' });

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAllTransactions();
        setTransactions(res.data || []);
        setFiltered(res.data || []);
      } catch { setError('Failed to load transactions.'); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  useEffect(() => {
    let data = [...transactions];
    if (filters.category) data = data.filter((t) => t.category?.toLowerCase().includes(filters.category.toLowerCase()));
    if (filters.date) data = data.filter((t) => t.date?.startsWith(filters.date));
    if (filters.type) data = data.filter((t) => t.type === filters.type);
    setFiltered(data);
  }, [filters, transactions]);

  const handleFilter = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <h4 className="fw-bold mb-4 text-primary">Transactions</h4>
      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="border-0 shadow-sm rounded-4 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Control name="category" placeholder="Filter by category" value={filters.category} onChange={handleFilter} />
            </Col>
            <Col md={4}>
              <Form.Control type="date" name="date" value={filters.date} onChange={handleFilter} />
            </Col>
            <Col md={4}>
              <Form.Select name="type" value={filters.type} onChange={handleFilter}>
                <option value="">All Types</option>
                <option value="CREDIT">Credit</option>
                <option value="DEBIT">Debit</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr><th>#</th><th>Type</th><th>Amount</th><th>Category</th><th>Description</th><th>Date</th></tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted py-4">No transactions found.</td></tr>
              ) : filtered.map((tx, i) => (
                <tr key={tx.id || i}>
                  <td>{i + 1}</td>
                  <td>
                    <Badge bg={tx.type === 'CREDIT' ? 'success' : 'danger'}>{tx.type}</Badge>
                  </td>
                  <td className={tx.type === 'CREDIT' ? 'text-success fw-semibold' : 'text-danger fw-semibold'}>
                    {tx.type === 'CREDIT' ? '+' : '-'}${tx.amount}
                  </td>
                  <td>{tx.category || '—'}</td>
                  <td>{tx.description || '—'}</td>
                  <td>{tx.date?.slice(0, 10) || '—'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Layout>
  );
};

export default Transactions;
