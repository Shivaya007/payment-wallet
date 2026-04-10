import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, Modal, Form, Table } from 'react-bootstrap';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { getBankAccounts, addBankAccount, transferToWallet } from '../services/bankService';

const BankAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [addModal, setAddModal] = useState(false);
  const [transferModal, setTransferModal] = useState({ show: false, accountId: null });
  const [form, setForm] = useState({ accountNumber: '', bankName: '', ifscCode: '', accountHolder: '' });
  const [transferAmount, setTransferAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchAccounts = async () => {
    try {
      const res = await getBankAccounts();
      setAccounts(res.data || []);
    } catch { setError('Failed to load bank accounts.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const handleAdd = async () => {
    if (!form.accountNumber || !form.bankName) { setError('Account number and bank name are required.'); return; }
    setSubmitting(true);
    try {
      await addBankAccount(form);
      setSuccess('Bank account added.');
      setAddModal(false);
      setForm({ accountNumber: '', bankName: '', ifscCode: '', accountHolder: '' });
      fetchAccounts();
    } catch (err) { setError(err.response?.data?.message || 'Failed to add account.'); }
    finally { setSubmitting(false); }
  };

  const handleTransfer = async () => {
    if (!transferAmount || isNaN(transferAmount) || Number(transferAmount) <= 0) {
      setError('Enter a valid amount.');
      return;
    }
    setSubmitting(true);
    try {
      await transferToWallet(transferModal.accountId, { amount: Number(transferAmount) });
      setSuccess('Transfer to wallet successful.');
      setTransferModal({ show: false, accountId: null });
      setTransferAmount('');
    } catch (err) { setError(err.response?.data?.message || 'Transfer failed.'); }
    finally { setSubmitting(false); }
  };

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary mb-0">Bank Accounts</h4>
        <Button variant="primary" onClick={() => setAddModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>Add Account
        </Button>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr><th>#</th><th>Account Holder</th><th>Account No.</th><th>Bank</th><th>IFSC</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {accounts.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted py-4">No bank accounts found.</td></tr>
              ) : accounts.map((acc, i) => (
                <tr key={acc.id || i}>
                  <td>{i + 1}</td>
                  <td>{acc.accountHolder || '—'}</td>
                  <td>{acc.accountNumber}</td>
                  <td>{acc.bankName}</td>
                  <td>{acc.ifscCode || '—'}</td>
                  <td>
                    <Button size="sm" variant="outline-primary" onClick={() => setTransferModal({ show: true, accountId: acc.id })}>
                      Transfer to Wallet
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Add Account Modal */}
      <Modal show={addModal} onHide={() => setAddModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Add Bank Account</Modal.Title></Modal.Header>
        <Modal.Body>
          {['accountHolder', 'accountNumber', 'bankName', 'ifscCode'].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label className="text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
              <Form.Control value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
            </Form.Group>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAdd} disabled={submitting}>{submitting ? 'Adding...' : 'Add'}</Button>
        </Modal.Footer>
      </Modal>

      {/* Transfer Modal */}
      <Modal show={transferModal.show} onHide={() => setTransferModal({ show: false, accountId: null })} centered>
        <Modal.Header closeButton><Modal.Title>Transfer to Wallet</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Amount ($)</Form.Label>
            <Form.Control type="number" min="1" value={transferAmount} onChange={(e) => setTransferAmount(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setTransferModal({ show: false, accountId: null })}>Cancel</Button>
          <Button variant="primary" onClick={handleTransfer} disabled={submitting}>{submitting ? 'Transferring...' : 'Transfer'}</Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default BankAccounts;
