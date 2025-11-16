import { formatDate } from '../../utils/dateFormatter.js';
import './MessageList.css';

function MessageList({ messages, selectedMessage, onSelect, activeTab }) {
    if (messages.length === 0) {
        return (
            <p className="no-messages">
                {activeTab === 'sent' ? 'No sent messages' : 'No messages in inbox'}
            </p>
        );
    }

    return (
        <div className="messages-list">
            {messages.map(msg => (
                <div
                    key={msg.id}
                    className={`message-item ${
                        !msg.isRead && activeTab === 'inbox' ? 'unread' : ''
                    } ${selectedMessage?.id === msg.id ? 'selected' : ''}`}
                    onClick={() => onSelect(msg)}
                >
                    <div className="message-sender">
                        {activeTab === 'inbox'
                            ? msg.senderName || msg.senderUsername || 'Unknown'
                            : msg.receiverName || msg.receiverUsername || 'Unknown'}
                        {!msg.isRead && activeTab === 'inbox' && (
                            <span className="unread-badge">New</span>
                        )}
                    </div>
                    <div className="message-subject">{msg.subject}</div>
                    <div className="message-date">{formatDate(msg.sentDate || msg.sentAt)}</div>
                </div>
            ))}
        </div>
    );
}

export default MessageList;
