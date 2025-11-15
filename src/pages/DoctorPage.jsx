// src/pages/DoctorPage.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./DoctorPage.css";

function DoctorPage({ token }) {
    const [patients, setPatients] = useState([]);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [conditions, setConditions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showConditionForm, setShowConditionForm] = useState(false);
    const [newCondition, setNewCondition] = useState({
        patientId: "",
        diagnosis: "",
        description: "",
        status: "ACTIVE",
        severity: "",
    });

    useEffect(() => {
        fetchPatients();
    }, [token]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/patients", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setPatients(data);
        } catch (error) {
            console.error("Error fetching patients:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatientConditions = async (patientId) => {
        try {
            const response = await fetch(`/api/conditions/patient/${patientId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setConditions(data);
        } catch (error) {
            console.error("Error fetching conditions:", error);
        }
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        fetchPatientConditions(patient.id);
        setShowConditionForm(false);
    };

    const handleCreateCondition = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("/api/conditions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...newCondition,
                    patientId: selectedPatient.id,
                }),
            });

            if (response.ok) {
                setNewCondition({
                    patientId: "",
                    diagnosis: "",
                    description: "",
                    status: "ACTIVE",
                    severity: "",
                });
                setShowConditionForm(false);
                fetchPatientConditions(selectedPatient.id);
                alert("Condition added successfully!");
            } else {
                const text = await response.text();
                alert(`Error creating condition: ${text || response.status}`);
            }
        } catch (error) {
            console.error("Error creating condition:", error);
            alert("Error creating condition");
        }
    };

    return (
        <div className="doctor-page">
            <div className="doctor-header">
                <h1>Doctor Dashboard</h1>
                <p>Manage patient conditions and medical records</p>
            </div>

            <div className="doctor-layout">
                <div className="patients-sidebar">
                    <h3>Patients</h3>
                    {loading ? (
                        <p>Loading patients...</p>
                    ) : (
                        <div className="patients-list">
                            {patients.map((patient) => (
                                <div
                                    key={patient.id}
                                    className={`patient-item ${
                                        selectedPatient?.id === patient.id ? "selected" : ""
                                    }`}
                                    onClick={() => handlePatientSelect(patient)}
                                >
                                    <strong>
                                        {patient.firstName} {patient.lastName}
                                    </strong>
                                    <span>SSN: {patient.socialSecurityNumber}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="patient-details">
                    {selectedPatient ? (
                        <>
                            <div className="patient-info">
                                <h2>
                                    {selectedPatient.firstName} {selectedPatient.lastName}
                                </h2>
                                <div className="patient-meta">
                                    <span>SSN: {selectedPatient.socialSecurityNumber}</span>
                                    <span>
                    DOB:{" "}
                                        {new Date(
                                            selectedPatient.dateOfBirth
                                        ).toLocaleDateString()}
                  </span>
                                    <span>
                    Phone: {selectedPatient.phoneNumber || "N/A"}
                  </span>
                                </div>
                            </div>

                            <div className="conditions-section">
                                <div className="section-header">
                                    <h3>Medical Conditions</h3>
                                    <button
                                        className="btn-primary"
                                        onClick={() =>
                                            setShowConditionForm(!showConditionForm)
                                        }
                                    >
                                        Add Condition
                                    </button>
                                </div>

                                {showConditionForm && (
                                    <form
                                        onSubmit={handleCreateCondition}
                                        className="condition-form"
                                    >
                                        <h4>Add New Condition</h4>
                                        <div className="form-group">
                                            <label>Diagnosis:</label>
                                            <input
                                                type="text"
                                                value={newCondition.diagnosis}
                                                onChange={(e) =>
                                                    setNewCondition({
                                                        ...newCondition,
                                                        diagnosis: e.target.value,
                                                    })
                                                }
                                                required
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Description:</label>
                                            <textarea
                                                value={newCondition.description}
                                                onChange={(e) =>
                                                    setNewCondition({
                                                        ...newCondition,
                                                        description: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label>Status:</label>
                                            <select
                                                value={newCondition.status}
                                                onChange={(e) =>
                                                    setNewCondition({
                                                        ...newCondition,
                                                        status: e.target.value,
                                                    })
                                                }
                                            >
                                                <option value="ACTIVE">Active</option>
                                                <option value="RESOLVED">Resolved</option>
                                                <option value="INACTIVE">Inactive</option>
                                                <option value="RECURRENCE">Recurrence</option>
                                            </select>
                                        </div>
                                        <div className="form-group">
                                            <label>Severity:</label>
                                            <input
                                                type="text"
                                                value={newCondition.severity}
                                                onChange={(e) =>
                                                    setNewCondition({
                                                        ...newCondition,
                                                        severity: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>
                                        <div className="form-actions">
                                            <button type="submit" className="btn-primary">
                                                Save Condition
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-secondary"
                                                onClick={() => setShowConditionForm(false)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                )}

                                <div className="conditions-list">
                                    {conditions.length === 0 ? (
                                        <p>No conditions recorded for this patient.</p>
                                    ) : (
                                        conditions.map((condition) => (
                                            <div
                                                key={condition.id}
                                                className="condition-card"
                                            >
                                                <div className="condition-header">
                                                    <h4>{condition.diagnosis}</h4>
                                                    <span
                                                        className={`status-badge ${condition.status.toLowerCase()}`}
                                                    >
                            {condition.status}
                          </span>
                                                </div>
                                                {condition.description && (
                                                    <p>{condition.description}</p>
                                                )}
                                                <div className="condition-meta">
                          <span>
                            Severity:{" "}
                              {condition.severity || "Not specified"}
                          </span>
                                                    <span>
                            Diagnosed:{" "}
                                                        {new Date(
                                                            condition.diagnosisDate
                                                        ).toLocaleDateString()}
                          </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            <div className="action-buttons">
                                {selectedPatient && (
                                    <Link
                                        to="/messages"
                                        state={{
                                            receiverUserId: selectedPatient.user?.id,
                                            receiverLabel: `${selectedPatient.firstName} ${selectedPatient.lastName} (patient)`,
                                        }}
                                        className="btn-secondary"
                                    >
                                        Send Message to Patient
                                    </Link>
                                )}

                                <Link to="/patients" className="btn-primary">
                                    Manage All Patients
                                </Link>
                            </div>
                        </>
                    ) : (
                        <div className="no-patient-selected">
                            <h3>Select a patient to view details</h3>
                            <p>
                                Choose a patient from the list to view their medical
                                conditions and add new diagnoses.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DoctorPage;
