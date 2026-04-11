import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', pwd: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.email || !form.pwd) {
      setError('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.pwd);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center bg-light"
      style={{ minHeight: '100vh' }}
    >
      <Container style={{ maxWidth: '420px' }}>
        <div className="text-center mb-4">
          <i className="bi bi-wallet2 text-primary" style={{ fontSize: '2.5rem' }}></i>
          <h3 className="fw-bold text-primary mt-2">PayWallet</h3>
          <p className="text-muted">Sign in to your account</p>
        </div>
        <Card className="shadow border-0 rounded-4">
          <Card.Body className="p-4">
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={form.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="pwd"
                  placeholder="Enter password"
                  value={form.pwd}
                  onChange={handleChange}
                />
              </Form.Group>
              <Button
                type="submit"
                variant="primary"
                className="w-100 fw-semibold"
                disabled={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </Form>
            <p className="text-center mt-3 mb-0 text-muted">
              Don't have an account?{' '}
              <Link to="/signup" className="text-primary fw-semibold">
                Sign Up
              </Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
