// src/pages/PatientManagementPage.jsx
import { useState, useEffect } from "react";
import "./PatientManagementPage.css";

function PatientManagementPage({ token }) {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchPatients(); }, [token]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/patients", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setPatients(data);
        } catch (e) {
            console.error("patients", e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="patient-management-page">
            <div className="page-header">
                <h1>Patient Management</h1>
                <p>View and manage patients</p>
            </div>

            {loading ? (
                <div className="loading">Loading patients...</div>
            ) : (
                <div className="patients-table-container">
                    <table className="patients-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Social Security Number</th>
                            <th>Date of Birth</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Username</th>
                        </tr>
                        </thead>
                        <tbody>
                        {patients.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td><strong>{p.firstName} {p.lastName}</strong></td>
                                <td>{p.socialSecurityNumber}</td>
                                <td>{new Date(p.dateOfBirth).toLocaleDateString()}</td>
                                <td>{p.phoneNumber || "N/A"}</td>
                                <td>{p.address || "N/A"}</td>
                                <td>{p.user?.username || "N/A"}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    {patients.length === 0 && (
                        <div className="no-data">
                            <p>No patients found.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default PatientManagementPage;
