import React, { useEffect, useState } from 'react';
import { Card, Button, Alert, Modal, Form, Table } from 'react-bootstrap';
import Layout from '../components/Layout';
import Loader from '../components/Loader';
import { getBeneficiaries, addBeneficiary, deleteBeneficiary } from '../services/beneficiaryService';

const Beneficiaries = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', accountNumber: '', bankName: '', ifscCode: '' });
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
    if (!form.name || !form.accountNumber) { setError('Name and account number are required.'); return; }
    setSubmitting(true);
    try {
      await addBeneficiary(form);
      setSuccess('Beneficiary added.');
      setShowModal(false);
      setForm({ name: '', accountNumber: '', bankName: '', ifscCode: '' });
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
              <tr><th>#</th><th>Name</th><th>Account No.</th><th>Bank</th><th>IFSC</th><th>Action</th></tr>
            </thead>
            <tbody>
              {list.length === 0 ? (
                <tr><td colSpan={6} className="text-center text-muted py-4">No beneficiaries found.</td></tr>
              ) : list.map((b, i) => (
                <tr key={b.id || i}>
                  <td>{i + 1}</td>
                  <td>{b.name}</td>
                  <td>{b.accountNumber}</td>
                  <td>{b.bankName || '—'}</td>
                  <td>{b.ifscCode || '—'}</td>
                  <td>
                    <Button size="sm" variant="outline-danger" onClick={() => handleDelete(b.id)}>
                      <i className="bi bi-trash"></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton><Modal.Title>Add Beneficiary</Modal.Title></Modal.Header>
        <Modal.Body>
          {['name', 'accountNumber', 'bankName', 'ifscCode'].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label className="text-capitalize">{field.replace(/([A-Z])/g, ' $1')}</Form.Label>
              <Form.Control
                placeholder={field}
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              />
            </Form.Group>
          ))}
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
