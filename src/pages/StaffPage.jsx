// src/pages/StaffPage.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../services/patientService';
import { messageService } from '../services/messageService';
import './StaffPage.css';

function StaffPage({ token }) {
    const [patients, setPatients] = useState([]);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [token]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [patientsData, unreadData] = await Promise.all([
                patientService.getAll(token),
                messageService.getUnread(token)
            ]);
            setPatients(patientsData);
            setUnreadMessages(unreadData.length);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="staff-page">
            <div className="staff-header">
                <h1>Staff Dashboard</h1>
                <p>Manage patient information and communications</p>
            </div>

            <div className="staff-stats">
                <div className="stat-card">
                    <h3>Total Patients</h3>
                    <p className="stat-number">{patients.length}</p>
                </div>
                <div className="stat-card">
                    <h3>Unread Messages</h3>
                    <p className="stat-number">{unreadMessages}</p>
                </div>
            </div>

            <div className="staff-actions">
                <Link to="/patients" className="action-card">
                    <div className="action-icon">👥</div>
                    <h3>Patient Management</h3>
                    <p>View and manage all patient records</p>
                </Link>

                <Link to="/messages" className="action-card">
                    <div className="action-icon">✉️</div>
                    <h3>Messages</h3>
                    <p>Communicate with patients and colleagues</p>
                    {unreadMessages > 0 && (
                        <span className="notification-badge">{unreadMessages}</span>
                    )}
                </Link>
            </div>

            <div className="recent-patients">
                <h2>Recent Patients</h2>
                {loading ? (
                    <p>Loading patients...</p>
                ) : (
                    <div className="patients-grid">
                        {patients.slice(0, 6).map(patient => (
                            <div key={patient.id} className="patient-card">
                                <h4>{patient.firstName} {patient.lastName}</h4>
                                <div className="patient-info">
                                    <p><strong>SSN:</strong> {patient.socialSecurityNumber}</p>
                                    <p><strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                                    {patient.phoneNumber && (
                                        <p><strong>Phone:</strong> {patient.phoneNumber}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default StaffPage;
