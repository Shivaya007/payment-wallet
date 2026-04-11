import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, Modal, Form, Table } from 'react-bootstrap';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { getBeneficiaries, addBeneficiary, deleteBeneficiary, sendMoneyApi } from '../services/beneficiaryService';

const Beneficiaries = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ beneficiaryName: '', mobileNumber: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchList = async () => {
    try {
      const res = await getBeneficiaries();
      setList(res.data || []);
    } catch { setError('Failed to load beneficiaries.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchList(); }, []);

  const handleAdd = async () => {
    if (!form.beneficiaryName || !form.mobileNumber) {
      setError('Name and mobile number are required.');
      return;
    }

    if (!/^\d{10}$/.test(form.mobileNumber)) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }

    setSubmitting(true);
    try {
      await addBeneficiary(form);
      setSuccess('Beneficiary added.');
      setShowModal(false);
      setForm({ beneficiaryName: '', mobileNumber: '' });
      fetchList();
    } catch (err) { setError(err.response?.data?.message || 'Failed to add.'); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this beneficiary?')) return;
    try {
      await deleteBeneficiary(id);
      setSuccess('Beneficiary deleted.');
      fetchList();
    } catch { setError('Failed to delete.'); }
  };
const handleSendMoney = async (mobileNumber) => {
  const amount = prompt('Enter amount to send:');
  if (!amount || isNaN(amount) || Number(amount) <= 0) {
    setError('Invalid amount');
    return;
  }

  if (!window.confirm(`Send ₹${amount} to ${mobileNumber}?`)) return;

  try {
    await sendMoneyApi(mobileNumber, String(amount));
    setSuccess('Money sent successfully');
    fetchList();
  } 
catch (err) {
  const msg =
    typeof err.response?.data === 'string'
      ? err.response.data
      : err.response?.data?.message;

  setError(msg || 'Transaction failed');
}

};

  if (loading) return <Layout><Loader /></Layout>;

  return (
    <Layout>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold text-primary mb-0">Beneficiaries</h4>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          <i className="bi bi-plus-lg me-2"></i>Add Beneficiary
        </Button>
      </div>
      {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

      <Card className="border-0 shadow-sm rounded-4">
        <Card.Body className="p-0">
          <Table hover responsive className="mb-0">
            <thead className="table-light">
              <tr><th>#</th><th>Name</th><th>Mobile Number</th><th>Action</th></tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-muted py-4">No beneficiaries found.</td></tr>
              ) : list.map((b, i) => {
                const id = b.beneficiaryId || b.id;
                return (
                  <tr key={id || i}>
                    <td>{i + 1}</td>
                    <td>{b.beneficiaryName || b.name}</td>
                    <td>{b.mobileNumber || '—'}</td>
                    <td>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(id)}>
                        <i className="bi bi-trash"></i></Button>
                     
<Button
  size="sm"
  className="ms-2"
  variant="outline-success"
  onClick={() => handleSendMoney(b.mobileNumber)}
>
  Pay
</Button>

                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Add Beneficiary</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="Enter beneficiary name"
              value={form.beneficiaryName}
              onChange={(e) => setForm({ ...form, beneficiaryName: e.target.value })}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="String"
              placeholder="Enter 10-digit mobile number"
              value={form.mobileNumber}
              maxLength={10}
              onChange={(e) => setForm({ ...form, mobileNumber: e.target.value.replace(/[^0-9]/g, '') })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAdd} disabled={submitting}>
            {submitting ? 'Adding...' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default Beneficiaries;
