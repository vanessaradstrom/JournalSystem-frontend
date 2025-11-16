import { useState, useEffect, useCallback } from 'react';
import { messageService } from '../services/messageService';

export const useMessages = (token) => {
    const [inboxMessages, setInboxMessages] = useState([]);
    const [sentMessages, setSentMessages] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [error, setError] = useState(null);

    const fetchMessages = useCallback(async () => {
        if (!token) return;

        setError(null);

        try {
            const inbox = await messageService.getInbox(token);
            setInboxMessages(inbox || []);
            setUnreadCount(inbox ? inbox.filter((m) => m.isRead === false).length : 0);

            try {
                const sent = await messageService.getSent(token);
                setSentMessages(sent || []);
            } catch (sentError) {
                console.error('Error fetching sent messages:', sentError);
                setSentMessages([]);
            }
        } catch (e) {
            setError('Failed to load messages');
            console.error('Error fetching messages:', e);
            setInboxMessages([]);
            setSentMessages([]);
        }
    }, [token]);

    const markAsRead = useCallback(async (messageId) => {
        try {
            // Optimistic update
            setInboxMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId ? { ...msg, isRead: true } : msg
                )
            );
            setUnreadCount(prev => Math.max(0, prev - 1));

            // Backend call
            await messageService.markAsRead(messageId, token);
        } catch (e) {
            console.error('Error marking message as read:', e);
            // Revert on error
            fetchMessages();
        }
    }, [token, fetchMessages]);

    const sendMessage = useCallback(async (messageData) => {
        try {
            await messageService.send(messageData, token);
            await fetchMessages();
            return { success: true };
        } catch (e) {
            console.error('Error sending message:', e);
            return { success: false, error: e.message };
        }
    }, [token, fetchMessages]);

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    return {
        inboxMessages,
        sentMessages,
        unreadCount,
        error,
        markAsRead,
        sendMessage,
        refetch: fetchMessages
    };
};
