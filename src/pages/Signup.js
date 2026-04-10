import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../services/authService';

const Signup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password) {
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
                <Form.Control name="name" placeholder="John Doe" value={form.name} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" name="email" placeholder="john@example.com" value={form.email} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Phone</Form.Label>
                <Form.Control name="phone" placeholder="+1234567890" value={form.phone} onChange={handleChange} />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" name="password" placeholder="Min 6 characters" value={form.password} onChange={handleChange} />
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
