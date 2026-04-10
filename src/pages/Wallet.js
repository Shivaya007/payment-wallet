import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { getWallet, creditWallet, debitWallet } from '../services/walletService';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [modal, setModal] = useState({ show: false, type: '' });
  const [amount, setAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchWallet = async () => {
    try {
      const res = await getWallet();
      setWallet(res.data);
    } catch {
      setError('Failed to load wallet.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchWallet(); }, []);

  const handleTransaction = async () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      if (modal.type === 'credit') {
        await creditWallet(wallet.walletId, { amount: Number(amount) });
      } else {
        await debitWallet(wallet.walletId, { amount: Number(amount) });
      }
      setSuccess(`${modal.type === 'credit' ? 'Credited' : 'Debited'} $${amount} successfully.`);
      setModal({ show: false, type: '' });
      setAmount('');
      fetchWallet();
    } catch (err) {
      setError(err.response?.data?.message || 'Transaction failed.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <h4 className="fw-bold mb-4 text-primary">My Wallet</h4>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Row className="g-4">
        <Col md={5}>
          <Card className="border-0 shadow rounded-4 text-white bg-primary">
            <Card.Body className="p-4">
              <div className="small opacity-75 mb-1">Wallet Balance</div>
              <div className="display-5 fw-bold">${wallet?.balance ?? '0.00'}</div>
              <hr className="border-white opacity-25" />
              <div className="small">Wallet ID: <strong>{wallet?.walletId}</strong></div>
              <div className="small">Status: <strong>{wallet?.status || 'Active'}</strong></div>
            </Card.Body>
          </Card>
          <div className="d-flex gap-3 mt-3">
            <Button variant="success" className="flex-grow-1 fw-semibold" onClick={() => setModal({ show: true, type: 'credit' })}>
              <i className="bi bi-plus-circle me-2"></i>Credit
            </Button>
            <Button variant="danger" className="flex-grow-1 fw-semibold" onClick={() => setModal({ show: true, type: 'debit' })}>
              <i className="bi bi-dash-circle me-2"></i>Debit
            </Button>
          </div>
        </Col>
        <Col md={7}>
          <Card className="border-0 shadow-sm rounded-4 h-100">
            <Card.Header className="bg-white border-0 fw-bold pt-3">Wallet Info</Card.Header>
            <Card.Body>
              <table className="table table-borderless">
                <tbody>
                  {[['Wallet ID', wallet?.walletId], ['Balance', `$${wallet?.balance}`], ['Currency', wallet?.currency || 'USD'], ['Status', wallet?.status || 'Active'], ['Created', wallet?.createdAt?.slice(0, 10)]].map(([k, v]) => (
                    <tr key={k}>
                      <td className="text-muted fw-semibold">{k}</td>
                      <td>{v || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={modal.show} onHide={() => setModal({ show: false, type: '' })} centered>
        <Modal.Header closeButton>
          <Modal.Title className="text-capitalize">{modal.type} Wallet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Amount ($)</Form.Label>
            <Form.Control
              type="number"
              min="1"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModal({ show: false, type: '' })}>Cancel</Button>
          <Button
            variant={modal.type === 'credit' ? 'success' : 'danger'}
            onClick={handleTransaction}
            disabled={submitting}
          >
            {submitting ? 'Processing...' : `Confirm ${modal.type}`}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Wallet;
