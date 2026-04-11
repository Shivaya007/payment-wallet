import React, { useState, useEffect } from 'react';
import { Table, Spinner } from 'react-bootstrap';
import AdminLayout from '../components/AdminLayout';
import { getAllBeneficiaries } from '../services/adminService';

const AdminBeneficiaries = () => {
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBeneficiaries = async () => {
      try {
        const res = await getAllBeneficiaries();
        setBeneficiaries(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadBeneficiaries();
  }, []);

  return (
    <AdminLayout>
      <div className="mb-4">
        <h1 className="h3 fw-bold">Beneficiaries</h1>
        <p className="text-secondary mb-0">View all registered beneficiaries in the system.</p>
      </div>

      {loading ? (
        <div className="d-flex justify-content-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded-4 p-3">
          <Table hover className="mb-0 align-middle">
            <thead className="table-light">
              <tr>
                <th>Name</th>
                <th>Account Number</th>
                <th>Bank</th>
                <th>Customer</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No beneficiaries found.
                  </td>
                </tr>
              ) : (
                beneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id || beneficiary.beneficiaryId}>
                    <td>{beneficiary.name || beneficiary.fullName || 'N/A'}</td>
                    <td>{beneficiary.accountNumber || beneficiary.account || 'N/A'}</td>
                    <td>{beneficiary.bankName || beneficiary.bank || 'N/A'}</td>
                    <td>{beneficiary.customerName || beneficiary.customerEmail || 'N/A'}</td>
                    <td>
                      <span className={`badge ${beneficiary.active === false ? 'bg-secondary' : 'bg-success'}`}>
                        {beneficiary.active === false ? 'Inactive' : 'Active'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminBeneficiaries;
