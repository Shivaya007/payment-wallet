import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, Modal, Form, Table, Badge, Row, Col } from 'react-bootstrap';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { payBill, getBillHistory } from '../services/billService';

const BILL_TYPES = ['Electricity', 'Water', 'Internet', 'Gas', 'Phone', 'Insurance', 'Other'];

const Bills = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ billType: '', billNumber: '', amount: '', provider: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchHistory = async () => {
    try {
      const res = await getBillHistory();
      setHistory(res.data || []);
    } catch { setError('Failed to load bill history.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchHistory(); }, []);

  const handlePay = async () => {
    if (!form.billType || !form.amount) { setError('Bill type and amount are required.'); return; }
    setSubmitting(true);
    try {
      await payBill({ ...form, amount: Number(form.amount) });
      setSuccess(`${form.billType} bill paid successfully.`);
      setShowModal(false);
      setForm({ billType: '', billNumber: '', amount: '', provider: '' });
      fetchHistory();
    } catch (err) { setError(err.response?.data?.message || 'Payment failed.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary mb-0">Bill Payments</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>Pay Bill
        </Button>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Quick bill type cards */}
      <Row className="g-3 mb-4">
        {BILL_TYPES.slice(0, 6).map((type) => (
          <Col xs={6} md={2} key={type}>
            <Card
              className="border-0 shadow-sm rounded-4 text-center p-3 h-100"
              style={{ cursor: 'pointer' }}
              onClick={() => { setForm({ ...form, billType: type }); setShowModal(true); }}
            >
              <i className="bi bi-receipt text-primary mb-1" style={{ fontSize: '1.5rem' }}></i>
              <div className="small fw-semibold">{type}</div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Header className="bg-white border-0 fw-bold pt-3">Payment History</Card.Header>
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr><th>#</th><th>Bill Type</th><th>Provider</th><th>Bill No.</th><th>Amount</th><th>Status</th><th>Date</th></tr>
            </thead>
            <tbody>
              {history.length === 0 ? (
                <tr><td colSpan={7} className="text-center text-muted py-4">No bill payments yet.</td></tr>
              ) : history.map((b, i) => (
                <tr key={b.id || i}>
                  <td>{i + 1}</td>
                  <td>{b.billType}</td>
                  <td>{b.provider || '—'}</td>
                  <td>{b.billNumber || '—'}</td>
                  <td className="fw-semibold">${b.amount}</td>
                  <td><Badge bg={b.status === 'SUCCESS' ? 'success' : 'warning'}>{b.status || 'PAID'}</Badge></td>
                  <td>{b.date?.slice(0, 10) || '—'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Pay Bill</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Bill Type</Form.Label>
            <Form.Select value={form.billType} onChange={(e) => setForm({ ...form, billType: e.target.value })}>
              <option value="">Select type</option>
              {BILL_TYPES.map((t) => <option key={t}>{t}</option>)}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Provider</Form.Label>
            <Form.Control placeholder="e.g. City Power Co." value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Bill Number</Form.Label>
            <Form.Control placeholder="Bill / Reference number" value={form.billNumber} onChange={(e) => setForm({ ...form, billNumber: e.target.value })} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Amount ($)</Form.Label>
            <Form.Control type="number" min="1" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handlePay} disabled={submitting}>{submitting ? 'Processing...' : 'Pay Now'}</Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Bills;
