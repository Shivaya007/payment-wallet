import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import { getAdminDashboard } from '../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getAdminDashboard();
        setStats(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="h3 fw-bold">Admin Dashboard</h1>
        <p className="text-secondary">Monitor customers, wallets, transactions and beneficiary activity.</p>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Row className="g-4 mb-4">
            <Col md={3} sm={6}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body>
                  <Card.Title className="h6 text-uppercase text-muted">Total Users</Card.Title>
                  <div className="display-6 fw-bold">{stats.totalUsers ?? 0}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body>
                  <Card.Title className="h6 text-uppercase text-muted">Total Wallets</Card.Title>
                  <div className="display-6 fw-bold">{stats.totalWallets ?? 0}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body>
                  <Card.Title className="h6 text-uppercase text-muted">Transactions</Card.Title>
                  <div className="display-6 fw-bold">{stats.totalTransactions ?? 0}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body>
                  <Card.Title className="h6 text-uppercase text-muted">Total Balance</Card.Title>
                  <div className="display-6 fw-bold">${stats.totalBalance?.toFixed(2) ?? '0.00'}</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row className="g-4">
            <Col lg={7}>
              <Card className="shadow-sm border-0 rounded-4">
                <Card.Body>
                  <Card.Title className="mb-3">Admin Actions</Card.Title>
                  <p className="text-muted">Quick access to manage customers, wallets and transactions.</p>
                  <div className="d-flex flex-wrap gap-2">
                    <Button variant="primary" href="/admin/customers">
                      Manage Customers
                    </Button>
                    <Button variant="outline-primary" href="/admin/wallets">
                      View Wallets
                    </Button>
                    <Button variant="outline-primary" href="/admin/transactions">
                      Review Transactions
                    </Button>
                    <Button variant="outline-primary" href="/admin/beneficiaries">
                      Beneficiaries
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={5}>
              <Card className="shadow-sm border-0 rounded-4 bg-primary text-white">
                <Card.Body>
                  <Card.Title>System Overview</Card.Title>
                  <p>Use the admin panel for secure access to all backend management endpoints.</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminDashboard;
