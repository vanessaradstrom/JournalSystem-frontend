// src/pages/MessagesPage.jsx
import { useState, useEffect } from "react";
import "./MessagesPage.css";

function MessagesPage({ token, role }) {
    const [messages, setMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [users, setUsers] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [showCompose, setShowCompose] = useState(false);
    const [newMessage, setNewMessage] = useState({
        receiverId: "",
        subject: "",
        content: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!token) return;
        fetchMessages();
        fetchRecipients();
    }, [token, role]);

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
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json().catch(() => null);
    };

    const apiPut = async (path) => {
        const res = await fetch(`/api${path}`, {
            method: "PUT",
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error(`${res.status}`);
        return null;
    };

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const data = await apiGet("/messages/inbox");
            setMessages(data);
            setUnreadCount(data.filter((m) => !m.read).length);
        } catch (e) {
            console.error("messages", e);
        } finally {
            setLoading(false);
        }
    };

    const fetchRecipients = async () => {
        try {
            if (role === "patient") {
                const data = await apiGet("/practitioners");
                setUsers(
                    data
                        .filter((p) => p.user?.id)
                        .map((p) => ({
                            id: p.user.id,
                            label: `${p.firstName} ${p.lastName} (${p.type})`,
                        }))
                );
            } else {
                const data = await apiGet("/patients");
                setUsers(
                    data
                        .filter((p) => p.user?.id)
                        .map((p) => ({
                            id: p.user.id,
                            label: `${p.firstName} ${p.lastName} (patient)`,
                        }))
                );
            }
        } catch (e) {
            console.error("recipients", e);
        }
    };

    const markAsRead = async (messageId) => {
        try {
            await apiPut(`/messages/${messageId}/read`);
            fetchMessages();
        } catch (e) {
            console.error("mark read", e);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            await apiPost("/messages", newMessage);
            setNewMessage({ receiverId: "", subject: "", content: "" });
            setShowCompose(false);
            await fetchMessages();
            alert("Message sent");
        } catch (e) {
            alert("Send failed");
        }
    };

    const handleMessageSelect = (message) => {
        setSelectedMessage(message);
        setShowCompose(false);
        if (!message.read) markAsRead(message.id);
    };

    return (
        <div className="messages-page">
            <div className="messages-header">
                <h1>Messages</h1>
                <div className="messages-stats">
                    <span className="unread-badge">{unreadCount} unread</span>
                    <button className="btn-primary" onClick={() => setShowCompose(true)}>
                        Compose New Message
                    </button>
                </div>
            </div>

            <div className="messages-layout">
                <div className="messages-sidebar">
                    <h3>Inbox ({messages.length})</h3>
                    {loading ? (
                        <p>Loading messages...</p>
                    ) : (
                        <div className="messages-list">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`message-item ${
                                        selectedMessage?.id === message.id ? "selected" : ""
                                    } ${!message.read ? "unread" : ""}`}
                                    onClick={() => handleMessageSelect(message)}
                                >
                                    <div className="message-preview">
                                        <strong>{message.senderUsername}</strong>
                                        <span className="subject">{message.subject}</span>
                                        <span className="date">
                      {new Date(message.sentAt).toLocaleDateString()}
                    </span>
                                    </div>
                                    {!message.read && <div className="unread-dot"></div>}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="message-content">
                    {selectedMessage ? (
                        <div className="message-detail">
                            <div className="message-header">
                                <h2>{selectedMessage.subject}</h2>
                                <div className="message-meta">
                  <span>
                    <strong>From:</strong> {selectedMessage.senderUsername}
                  </span>
                                    <span>
                    <strong>To:</strong> {selectedMessage.receiverUsername}
                  </span>
                                    <span>
                    <strong>Date:</strong>{" "}
                                        {new Date(selectedMessage.sentAt).toLocaleString()}
                  </span>
                                </div>
                            </div>
                            <div className="message-body">
                                <p>{selectedMessage.content}</p>
                            </div>
                        </div>
                    ) : showCompose ? (
                        <div className="compose-message">
                            <h2>Compose New Message</h2>
                            <form onSubmit={sendMessage} className="compose-form">
                                <div className="form-group">
                                    <label>To:</label>
                                    <select
                                        value={newMessage.receiverId}
                                        onChange={(e) =>
                                            setNewMessage({ ...newMessage, receiverId: e.target.value })
                                        }
                                        required
                                    >
                                        <option value="">Select recipient</option>
                                        {users.map((u) => (
                                            <option key={u.id} value={u.id}>
                                                {u.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Subject:</label>
                                    <input
                                        type="text"
                                        value={newMessage.subject}
                                        onChange={(e) =>
                                            setNewMessage({ ...newMessage, subject: e.target.value })
                                        }
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Message:</label>
                                    <textarea
                                        value={newMessage.content}
                                        onChange={(e) =>
                                            setNewMessage({ ...newMessage, content: e.target.value })
                                        }
                                        rows={8}
                                        required
                                    />
                                </div>
                                <div className="form-actions">
                                    <button type="submit" className="btn-primary">
                                        Send Message
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setShowCompose(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="no-message-selected">
                            <h3>Select a message to read</h3>
                            <p>Choose a message from your inbox or compose a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessagesPage;
