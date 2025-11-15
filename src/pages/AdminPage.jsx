// src/pages/AdminPage.jsx
import { useState, useEffect } from "react";
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

    const apiGet = async (path) => {
        const res = await fetch(`/api${path}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json();
    };

    const apiPost = async (path, body) => {
        const res = await fetch(`/api${path}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            const txt = await res.text();
            throw new Error(txt || `${res.status}`);
        }
        return res.json().catch(() => null);
    };

    const fetchUsers = async () => {
        try {
            const data = await apiGet("/users");
            setUsers(data);
        } catch (err) {
            console.error("users", err);
        }
    };

    const fetchOrganizations = async () => {
        try {
            const data = await apiGet("/organizations");
            setOrganizations(data);
        } catch (err) {
            console.error("orgs", err);
        }
    };

    const fetchPractitioners = async () => {
        try {
            const data = await apiGet("/practitioners");
            setPractitioners(data);
        } catch (err) {
            console.error("practitioners", err);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await apiPost("/users", newUser);
            setNewUser({ username: "", password: "", role: "PATIENT" });
            await fetchUsers();
            alert("User created");
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
            await apiPost("/patients", newPatient);
            setNewPatient({
                firstName: "",
                lastName: "",
                socialSecurityNumber: "",
                dateOfBirth: "",
                phoneNumber: "",
                address: "",
                userId: "",
            });
            alert("Patient created");
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
            await apiPost("/practitioners", newPractitioner);
            setNewPractitioner({
                firstName: "",
                lastName: "",
                type: "DOCTOR",
                licenseNumber: "",
                userId: "",
                organizationId: "",
            });
            await fetchPractitioners();
            alert("Practitioner created");
        } catch (err) {
            alert(`Create practitioner failed: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Admin</h1>
                <p>Manage users, patients, practitioners, organizations</p>
            </div>

            <div className="admin-tabs">
                <button
                    className={activeTab === "users" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("users")}
                >
                    Users ({users.length})
                </button>
                <button
                    className={activeTab === "create-user" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("create-user")}
                >
                    Create User
                </button>
                <button
                    className={activeTab === "create-patient" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("create-patient")}
                >
                    Create Patient
                </button>
                <button
                    className={activeTab === "create-practitioner" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("create-practitioner")}
                >
                    Create Practitioner
                </button>
                <button
                    className={activeTab === "practitioners" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("practitioners")}
                >
                    Practitioners ({practitioners.length})
                </button>
                <button
                    className={activeTab === "organizations" ? "tab active" : "tab"}
                    onClick={() => setActiveTab("organizations")}
                >
                    Organizations ({organizations.length})
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "users" && (
                    <div className="users-section">
                        <h2>User Management</h2>
                        <div className="table-container">
                            <table className="admin-table">
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
                        </div>
                    </div>
                )}

                {activeTab === "create-user" && (
                    <div className="create-section">
                        <h2>Create New User</h2>
                        <form onSubmit={handleCreateUser} className="admin-form">
                            <div className="form-group">
                                <label>Username:</label>
                                <input
                                    type="text"
                                    value={newUser.username}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, username: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Password:</label>
                                <input
                                    type="password"
                                    value={newUser.password}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, password: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Role:</label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) =>
                                        setNewUser({ ...newUser, role: e.target.value })
                                    }
                                >
                                    <option value="PATIENT">Patient</option>
                                    <option value="DOCTOR">Doctor</option>
                                    <option value="STAFF">Staff</option>
                                    <option value="ADMIN">Admin</option>
                                </select>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? "Creating..." : "Create User"}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === "create-patient" && (
                    <div className="create-section">
                        <h2>Create New Patient</h2>
                        <form onSubmit={handleCreatePatient} className="admin-form">
                            <div className="form-group">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={newPatient.firstName}
                                    onChange={(e) =>
                                        setNewPatient({ ...newPatient, firstName: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={newPatient.lastName}
                                    onChange={(e) =>
                                        setNewPatient({ ...newPatient, lastName: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Social Security Number:</label>
                                <input
                                    type="text"
                                    value={newPatient.socialSecurityNumber}
                                    onChange={(e) =>
                                        setNewPatient({
                                            ...newPatient,
                                            socialSecurityNumber: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Date of Birth:</label>
                                <input
                                    type="date"
                                    value={newPatient.dateOfBirth}
                                    onChange={(e) =>
                                        setNewPatient({
                                            ...newPatient,
                                            dateOfBirth: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number:</label>
                                <input
                                    type="text"
                                    value={newPatient.phoneNumber}
                                    onChange={(e) =>
                                        setNewPatient({
                                            ...newPatient,
                                            phoneNumber: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Address:</label>
                                <input
                                    type="text"
                                    value={newPatient.address}
                                    onChange={(e) =>
                                        setNewPatient({ ...newPatient, address: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>User ID (must exist):</label>
                                <input
                                    type="number"
                                    value={newPatient.userId}
                                    onChange={(e) =>
                                        setNewPatient({ ...newPatient, userId: e.target.value })
                                    }
                                    required
                                />
                                <small>User must exist with PATIENT role</small>
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? "Creating..." : "Create Patient"}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === "create-practitioner" && (
                    <div className="create-section">
                        <h2>Create New Practitioner</h2>
                        <form onSubmit={handleCreatePractitioner} className="admin-form">
                            <div className="form-group">
                                <label>First Name:</label>
                                <input
                                    type="text"
                                    value={newPractitioner.firstName}
                                    onChange={(e) =>
                                        setNewPractitioner({
                                            ...newPractitioner,
                                            firstName: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Last Name:</label>
                                <input
                                    type="text"
                                    value={newPractitioner.lastName}
                                    onChange={(e) =>
                                        setNewPractitioner({
                                            ...newPractitioner,
                                            lastName: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Type:</label>
                                <select
                                    value={newPractitioner.type}
                                    onChange={(e) =>
                                        setNewPractitioner({
                                            ...newPractitioner,
                                            type: e.target.value,
                                        })
                                    }
                                >
                                    <option value="DOCTOR">Doctor</option>
                                    <option value="NURSE">Nurse</option>
                                    <option value="RECEPTIONIST">Receptionist</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>License Number:</label>
                                <input
                                    type="text"
                                    value={newPractitioner.licenseNumber}
                                    onChange={(e) =>
                                        setNewPractitioner({
                                            ...newPractitioner,
                                            licenseNumber: e.target.value,
                                        })
                                    }
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>User ID (must exist):</label>
                                <input
                                    type="number"
                                    value={newPractitioner.userId}
                                    onChange={(e) =>
                                        setNewPractitioner({
                                            ...newPractitioner,
                                            userId: e.target.value,
                                        })
                                    }
                                    required
                                />
                                <small>User must exist with DOCTOR or STAFF role</small>
                            </div>
                            <div className="form-group">
                                <label>Organization ID (optional):</label>
                                <input
                                    type="number"
                                    value={newPractitioner.organizationId}
                                    onChange={(e) =>
                                        setNewPractitioner({
                                            ...newPractitioner,
                                            organizationId: e.target.value,
                                        })
                                    }
                                />
                            </div>
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? "Creating..." : "Create Practitioner"}
                            </button>
                        </form>
                    </div>
                )}

                {activeTab === "practitioners" && (
                    <div className="practitioners-section">
                        <h2>Practitioners</h2>
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>License</th>
                                    <th>Organization</th>
                                </tr>
                                </thead>
                                <tbody>
                                {practitioners.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>
                                            {p.firstName} {p.lastName}
                                        </td>
                                        <td>
                                            <span className="type-badge">{p.type}</span>
                                        </td>
                                        <td>{p.licenseNumber}</td>
                                        <td>{p.organization?.name || "None"}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === "organizations" && (
                    <div className="organizations-section">
                        <h2>Organizations</h2>
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Address</th>
                                </tr>
                                </thead>
                                <tbody>
                                {organizations.map((o) => (
                                    <tr key={o.id}>
                                        <td>{o.id}</td>
                                        <td>{o.name}</td>
                                        <td>{o.type || "N/A"}</td>
                                        <td>{o.address || "N/A"}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminPage;
