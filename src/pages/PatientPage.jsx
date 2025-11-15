// src/pages/PatientPage.jsx
import { useState, useEffect } from "react";
import "./PatientPage.css";

function PatientPage({ token }) {
    const [patientData, setPatientData] = useState(null);
    const [conditions, setConditions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("overview");
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPatientData();
    }, [token]);

    const fetchPatientData = async () => {
        try {
            setLoading(true);
            setError(null);

            const patientResponse = await fetch("/api/patients/me", {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!patientResponse.ok) {
                const text = await patientResponse.text();
                throw new Error(
                    `Failed to fetch patient data: ${patientResponse.status} - ${text}`
                );
            }

            const patient = await patientResponse.json();
            setPatientData(patient);

            if (patient.id) {
                const conditionsResponse = await fetch(
                    `/api/conditions/patient/${patient.id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (conditionsResponse.ok) {
                    const conditionsData = await conditionsResponse.json();
                    setConditions(conditionsData);
                }
            }
        } catch (err) {
            console.error("Error fetching patient data:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="patient-page">
                <div className="loading">Loading your health information...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="patient-page">
                <div className="error-message">
                    <h2>Error loading patient data</h2>
                    <p>{error}</p>
                    <button onClick={fetchPatientData} className="btn-primary">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!patientData) {
        return (
            <div className="patient-page">
                <div className="error-message">
                    <h2>No patient data found</h2>
                    <p>Contact support if this problem persists.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-page">
            <div className="patient-header">
                <h1>My Health Information</h1>
                <div className="patient-info-card">
                    <h2>Personal Information</h2>
                    <div className="info-grid">
                        <div className="info-item">
                            <label>Name:</label>
                            <span>
                {patientData.firstName} {patientData.lastName}
              </span>
                        </div>
                        <div className="info-item">
                            <label>Social Security Number:</label>
                            <span>{patientData.socialSecurityNumber}</span>
                        </div>
                        <div className="info-item">
                            <label>Date of Birth:</label>
                            <span>
                {new Date(patientData.dateOfBirth).toLocaleDateString()}
              </span>
                        </div>
                        <div className="info-item">
                            <label>Phone:</label>
                            <span>{patientData.phoneNumber || "Not provided"}</span>
                        </div>
                        {patientData.address && (
                            <div className="info-item">
                                <label>Address:</label>
                                <span>{patientData.address}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="tabs">
                <button
                    className={activeTab === "overview" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("overview")}
                >
                    Overview
                </button>
                <button
                    className={activeTab === "conditions" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("conditions")}
                >
                    Conditions ({conditions.length})
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "overview" && (
                    <div className="overview">
                        <div className="stats-grid">
                            <div className="stat-card">
                                <h3>Active Conditions</h3>
                                <p className="stat-number">
                                    {conditions.filter((c) => c.status === "ACTIVE").length}
                                </p>
                            </div>
                            <div className="stat-card">
                                <h3>Total Conditions</h3>
                                <p className="stat-number">{conditions.length}</p>
                            </div>
                        </div>

                        <div className="recent-conditions">
                            <h3>My Conditions</h3>
                            {conditions.length === 0 ? (
                                <div className="no-data">
                                    <p>No medical conditions recorded yet.</p>
                                </div>
                            ) : (
                                conditions.slice(0, 5).map((condition) => (
                                    <div key={condition.id} className="condition-item">
                                        <strong>{condition.diagnosis}</strong>
                                        <span className={`status ${condition.status.toLowerCase()}`}>
                      {condition.status}
                    </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {activeTab === "conditions" && (
                    <div className="conditions-list">
                        <h3>Medical Conditions</h3>
                        {conditions.length === 0 ? (
                            <div className="no-data">
                                <p>No medical conditions recorded.</p>
                            </div>
                        ) : (
                            conditions.map((condition) => (
                                <div key={condition.id} className="condition-card">
                                    <div className="condition-header">
                                        <h4>{condition.diagnosis}</h4>
                                        <span
                                            className={`status-badge ${condition.status.toLowerCase()}`}
                                        >
                      {condition.status}
                    </span>
                                    </div>
                                    {condition.description && (
                                        <p className="condition-description">
                                            {condition.description}
                                        </p>
                                    )}
                                    {condition.severity && (
                                        <p className="condition-severity">
                                            <strong>Severity:</strong> {condition.severity}
                                        </p>
                                    )}
                                    <div className="condition-footer">
                    <span>
                      Diagnosed:{" "}
                        {new Date(condition.diagnosisDate).toLocaleDateString()}
                    </span>
                                        {condition.diagnosedByName && (
                                            <span>By: {condition.diagnosedByName}</span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PatientPage;
