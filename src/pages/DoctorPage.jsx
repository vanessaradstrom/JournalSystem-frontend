import { useState } from 'react';
import { useDoctorDashboard } from '../hooks/useDoctorDashboard';
import { usePatientData } from '../hooks/usePatientData';
import { conditionService } from '../services/conditionService';
import { encounterService } from '../services/encounterService';
import ErrorMessage from '../components/common/ErrorMessage';
import PatientsList from '../components/lists/PatientsList';
import ConditionsList from '../components/lists/ConditionsList';
import EncountersList from '../components/lists/EncountersList';
import ConditionForm from '../components/forms/ConditionForm';
import EncounterForm from '../components/forms/EncounterForm';
import './DoctorPage.css';

// Import shared styles
import '../styles/buttons.css';
import '../styles/cards.css';
import '../styles/forms.css';
import '../styles/tabs.css';
import '../styles/badges.css';

function DoctorPage({ token }) {
    const {
        patients,
        currentPractitioner,
        locations,
        error: dashboardError,
        refetch: refetchDashboard,
        refreshLocations
    } = useDoctorDashboard(token);

    const [selectedPatient, setSelectedPatient] = useState(null);
    const [showConditionForm, setShowConditionForm] = useState(false);
    const [showEncounterForm, setShowEncounterForm] = useState(false);
    const [activeTab, setActiveTab] = useState('conditions');
    const [feedback, setFeedback] = useState(null);

    const {
        conditions,
        encounters,
        loading: loadingPatientData,
        refetch: refetchPatientData
    } = usePatientData(selectedPatient?.id, token);

    const showFeedback = (type, message) => {
        setFeedback({ type, message });
        setTimeout(() => setFeedback(null), 3000);
    };

    const handlePatientSelect = (patient) => {
        setSelectedPatient(patient);
        setShowConditionForm(false);
        setShowEncounterForm(false);
        setActiveTab('conditions');
        setFeedback(null);
    };

    const handleCreateCondition = async (conditionData) => {
        try {
            await conditionService.create(conditionData, token);
            setShowConditionForm(false);
            await refetchPatientData();
            showFeedback('success', 'Condition added successfully');
        } catch (error) {
            showFeedback('error', 'Error creating condition: ' + error.message);
            console.error('Error creating condition:', error);
        }
    };

    const handleCreateEncounter = async (encounterData) => {
        try {
            await encounterService.create(encounterData, token);
            setShowEncounterForm(false);
            await refetchPatientData();
            showFeedback('success', 'Encounter created successfully');
        } catch (error) {
            showFeedback('error', 'Error creating encounter: ' + error.message);
            console.error('Error creating encounter:', error);
        }
    };

    if (dashboardError) {
        return <ErrorMessage message={dashboardError} onRetry={refetchDashboard} />;
    }

    return (
        <div className="doctor-page">
            <div className="doctor-header">
                <h1>Doctor Dashboard</h1>
                <p>Manage patient conditions, encounters, and medical records</p>
                {currentPractitioner && (
                    <p className="practitioner-info">
                        Logged in as: <strong>Dr. {currentPractitioner.firstName} {currentPractitioner.lastName}</strong>
                    </p>
                )}
            </div>

            {feedback && (
                <div className={`feedback-banner ${feedback.type}`} role="alert">
                    {feedback.message}
                </div>
            )}

            <div className="doctor-layout">
                <aside className="patients-sidebar">
                    <h3>Patients</h3>
                    <PatientsList
                        patients={patients}
                        selectedPatient={selectedPatient}
                        onPatientSelect={handlePatientSelect}
                    />
                </aside>

                <main className="patient-details">
                    {selectedPatient ? (
                        <>
                            <div className="patient-info">
                                <h2>{selectedPatient.firstName} {selectedPatient.lastName}</h2>
                                <div className="patient-meta">
                                    <span>SSN: {selectedPatient.socialSecurityNumber}</span>
                                    <span>DOB: {new Date(selectedPatient.dateOfBirth).toLocaleDateString('sv-SE')}</span>
                                    <span>Phone: {selectedPatient.phoneNumber || 'N/A'}</span>
                                </div>
                            </div>

                            <div className="tabs">
                                <button
                                    className={activeTab === 'conditions' ? 'tab active' : 'tab'}
                                    onClick={() => setActiveTab('conditions')}
                                >
                                    Conditions ({conditions.length})
                                </button>
                                <button
                                    className={activeTab === 'encounters' ? 'tab active' : 'tab'}
                                    onClick={() => setActiveTab('encounters')}
                                >
                                    Encounters ({encounters.length})
                                </button>
                            </div>

                            {loadingPatientData && (
                                <div className="loading-text">
                                    Loading patient data...
                                </div>
                            )}

                            {activeTab === 'conditions' && !loadingPatientData && (
                                <section className="conditions-section">
                                    <div className="section-header">
                                        <h3>Medical Conditions</h3>
                                        <button
                                            className="btn-primary"
                                            onClick={() => setShowConditionForm(!showConditionForm)}
                                        >
                                            {showConditionForm ? 'Cancel' : 'Add Condition'}
                                        </button>
                                    </div>

                                    {showConditionForm && (
                                        <ConditionForm
                                            patientId={selectedPatient.id}
                                            onSubmit={handleCreateCondition}
                                            onCancel={() => setShowConditionForm(false)}
                                        />
                                    )}

                                    <ConditionsList conditions={conditions} />
                                </section>
                            )}

                            {activeTab === 'encounters' && !loadingPatientData && (
                                <section className="encounters-section">
                                    <div className="section-header">
                                        <h3>Patient Encounters</h3>
                                        <button
                                            className="btn-primary"
                                            onClick={() => setShowEncounterForm(!showEncounterForm)}
                                        >
                                            {showEncounterForm ? 'Cancel' : 'Add Encounter'}
                                        </button>
                                    </div>

                                    {showEncounterForm && (
                                        <EncounterForm
                                            patientId={selectedPatient.id}
                                            practitioner={currentPractitioner}
                                            locations={locations}
                                            onSubmit={handleCreateEncounter}
                                            onCancel={() => setShowEncounterForm(false)}
                                            onLocationCreated={refreshLocations}
                                            token={token}
                                        />
                                    )}

                                    <EncountersList encounters={encounters} />
                                </section>
                            )}
                        </>
                    ) : (
                        <div className="no-patient-selected">
                            <h3>Select a patient to view details</h3>
                            <p>Choose a patient from the list to view their medical conditions, encounters, and add new records.</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default DoctorPage;
