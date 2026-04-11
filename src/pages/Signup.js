import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ custName: '', email: '', pwd: '', mobileNumber: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.custName || !form.email || !form.pwd) {
      setError('Name, email and password are required.');
      return;
    }
    setLoading(true);
    try {
      await signup(form);
      setSuccess('Account created! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center bg-light"
      style={{ minHeight: '100vh' }}
    >
      <Container style={{ maxWidth: '440px' }}>
        <div className="text-center mb-4">
          <i className="bi bi-wallet2 text-primary" style={{ fontSize: '2.5rem' }}></i>
          <h3 className="fw-bold text-primary mt-2">PayWallet</h3>
          <p className="text-muted">Create your account</p>
        </div>
        <Card className="shadow border-0 rounded-4">
          <Card.Body className="p-4">
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Full Name</Form.Label>
                <Form.Control name="custName" placeholder="John Doe" value={form.custName} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mobile Number</Form.Label>
                <Form.Control name="mobileNumber" placeholder="9876543210" value={form.mobileNumber} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="pwd" placeholder="Min 6 characters" value={form.pwd} onChange={handleChange} />
              </Form.Group>
              <Button type="submit" variant="primary" className="w-100 fw-semibold" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </Form>
            <p className="text-center mt-3 mb-0 text-muted">
              Already have an account?{' '}
              <Link to="/login" className="text-primary fw-semibold">Sign In</Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Signup;
