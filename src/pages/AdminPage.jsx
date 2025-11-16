// src/pages/AdminPage.jsx
import { useState, useEffect } from "react";
import { userService } from "../services/userService";
import { patientService } from "../services/patientService";
import { practitionerService } from "../services/practitionerService";
import { organizationService } from "../services/organizationService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import "../styles/forms.css";
import "../styles/badges.css";
import "../styles/buttons.css";
import "./AdminPage.css";

function AdminPage({ token }) {
    const [users, setUsers] = useState([]);
    const [organizations, setOrganizations] = useState([]);
    const [practitioners, setPractitioners] = useState([]);
    const [activeTab, setActiveTab] = useState("users");
    const [loading, setLoading] = useState(false);

    const [newUser, setNewUser] = useState({
        username: "",
        password: "",
        role: "PATIENT",
    });

    const [newPatient, setNewPatient] = useState({
        firstName: "",
        lastName: "",
        socialSecurityNumber: "",
        dateOfBirth: "",
        phoneNumber: "",
        address: "",
        userId: "",
    });

    const [newPractitioner, setNewPractitioner] = useState({
        firstName: "",
        lastName: "",
        type: "DOCTOR",
        licenseNumber: "",
        userId: "",
        organizationId: "",
    });

    useEffect(() => {
        if (activeTab === "users") {
            fetchUsers();
        } else if (activeTab === "organizations") {
            fetchOrganizations();
        } else if (activeTab === "practitioners") {
            fetchPractitioners();
        }
    }, [activeTab, token]);

    const fetchUsers = async () => {
        try {
            const data = await userService.getAll(token);
            setUsers(data);
        } catch (err) {
            console.error("Error fetching users:", err);
        }
    };

    const fetchOrganizations = async () => {
        try {
            const data = await organizationService.getAll(token);
            setOrganizations(data);
        } catch (err) {
            console.error("Error fetching organizations:", err);
        }
    };

    const fetchPractitioners = async () => {
        try {
            const data = await practitionerService.getAll(token);
            setPractitioners(data);
        } catch (err) {
            console.error("Error fetching practitioners:", err);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await userService.create(newUser, token);
            setNewUser({ username: "", password: "", role: "PATIENT" });
            await fetchUsers();
            alert("User created successfully!");
        } catch (err) {
            alert(`Create user failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePatient = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await patientService.create(newPatient, token);
            setNewPatient({
                firstName: "",
                lastName: "",
                socialSecurityNumber: "",
                dateOfBirth: "",
                phoneNumber: "",
                address: "",
                userId: "",
            });
            alert("Patient created successfully!");
        } catch (err) {
            alert(`Create patient failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePractitioner = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await practitionerService.create(newPractitioner, token);
            setNewPractitioner({
                firstName: "",
                lastName: "",
                type: "DOCTOR",
                licenseNumber: "",
                userId: "",
                organizationId: "",
            });
            await fetchPractitioners();
            alert("Practitioner created successfully!");
        } catch (err) {
            alert(`Create practitioner failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <h1>Admin Dashboard</h1>

            <div className="tabs">
                <button
                    className={activeTab === "users" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("users")}
                >
                    Users
                </button>
                <button
                    className={activeTab === "organizations" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("organizations")}
                >
                    Organizations
                </button>
                <button
                    className={activeTab === "practitioners" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("practitioners")}
                >
                    Practitioners
                </button>
            </div>

            {activeTab === "users" && (
                <div className="tab-content">
                    <h2>Create User</h2>
                    <form onSubmit={handleCreateUser}>
                        <div className="form-group">
                            <label>Username:</label>
                            <input
                                type="text"
                                value={newUser.username}
                                onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input
                                type="password"
                                value={newUser.password}
                                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Role:</label>
                            <select
                                value={newUser.role}
                                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                            >
                                <option value="PATIENT">Patient</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="STAFF">Staff</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Creating..." : "Create User"}
                        </button>
                    </form>

                    <h2>All Users</h2>
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Role</th>
                        </tr>
                        </thead>
                        <tbody>
                        {users.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>
                                        <span className={`role-badge ${u.role.toLowerCase()}`}>
                                            {u.role}
                                        </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <h2>Create Patient</h2>
                    <form onSubmit={handleCreatePatient}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={newPatient.firstName}
                                    onChange={(e) => setNewPatient({ ...newPatient, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={newPatient.lastName}
                                    onChange={(e) => setNewPatient({ ...newPatient, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Social Security Number:</label>
                            <input
                                type="text"
                                value={newPatient.socialSecurityNumber}
                                onChange={(e) => setNewPatient({ ...newPatient, socialSecurityNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Date of Birth:</label>
                            <input
                                type="date"
                                value={newPatient.dateOfBirth}
                                onChange={(e) => setNewPatient({ ...newPatient, dateOfBirth: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Phone Number:</label>
                            <input
                                type="text"
                                value={newPatient.phoneNumber}
                                onChange={(e) => setNewPatient({ ...newPatient, phoneNumber: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>Address:</label>
                            <input
                                type="text"
                                value={newPatient.address}
                                onChange={(e) => setNewPatient({ ...newPatient, address: e.target.value })}
                            />
                        </div>
                        <div className="form-group">
                            <label>User ID:</label>
                            <input
                                type="number"
                                value={newPatient.userId}
                                onChange={(e) => setNewPatient({ ...newPatient, userId: e.target.value })}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Creating..." : "Create Patient"}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === "organizations" && (
                <div className="tab-content">
                    <h2>Organizations</h2>
                    {organizations.length === 0 ? (
                        <p>No organizations found.</p>
                    ) : (
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Type</th>
                                <th>Address</th>
                            </tr>
                            </thead>
                            <tbody>
                            {organizations.map((org) => (
                                <tr key={org.id}>
                                    <td>{org.id}</td>
                                    <td>{org.name}</td>
                                    <td>{org.type}</td>
                                    <td>{org.address || "N/A"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}

            {activeTab === "practitioners" && (
                <div className="tab-content">
                    <h2>Create Practitioner</h2>
                    <form onSubmit={handleCreatePractitioner}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={newPractitioner.firstName}
                                    onChange={(e) => setNewPractitioner({ ...newPractitioner, firstName: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={newPractitioner.lastName}
                                    onChange={(e) => setNewPractitioner({ ...newPractitioner, lastName: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Type:</label>
                            <select
                                value={newPractitioner.type}
                                onChange={(e) => setNewPractitioner({ ...newPractitioner, type: e.target.value })}
                            >
                                <option value="DOCTOR">Doctor</option>
                                <option value="NURSE">Nurse</option>
                                <option value="SPECIALIST">Specialist</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>License Number:</label>
                            <input
                                type="text"
                                value={newPractitioner.licenseNumber}
                                onChange={(e) => setNewPractitioner({ ...newPractitioner, licenseNumber: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>User ID:</label>
                            <input
                                type="number"
                                value={newPractitioner.userId}
                                onChange={(e) => setNewPractitioner({ ...newPractitioner, userId: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Organization ID (optional):</label>
                            <input
                                type="number"
                                value={newPractitioner.organizationId}
                                onChange={(e) => setNewPractitioner({ ...newPractitioner, organizationId: e.target.value })}
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? "Creating..." : "Create Practitioner"}
                        </button>
                    </form>

                    <h2>All Practitioners</h2>
                    <table className="data-table">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Type</th>
                            <th>License</th>
                        </tr>
                        </thead>
                        <tbody>
                        {practitioners.map((p) => (
                            <tr key={p.id}>
                                <td>{p.id}</td>
                                <td>{p.firstName} {p.lastName}</td>
                                <td>
                                        <span className="type-badge">
                                            {p.type}
                                        </span>
                                </td>
                                <td>{p.licenseNumber}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminPage;
