import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './messaging.css';

function MessageList({ currentUserId, authToken }) {
  const [conversations, setConversations] = useState({});
  const [activeConversationId, setActiveConversationId] = useState(null); // Changed variable name for clarity
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      const response = await axios.get('/api/messages', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const grouped = groupMessagesBySender(response.data);
      setConversations(grouped);
    } catch (error) {
      setError('Failed to fetch messages.');
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [authToken, currentUserId]);

  const groupMessagesBySender = (messages) => {
    return messages.reduce((groups, message) => {
      const senderId = message.sender_id === currentUserId ? message.receiver_id : message.sender_id;
      if (!groups[senderId]) {
        groups[senderId] = {
          sender: message.sender_username,
          messages: [],
          unread: false,
        };
      }
      groups[senderId].messages.push(message);
      if (!message.is_read && message.receiver_id === currentUserId) {
        groups[senderId].unread = true;
      }
      return groups;
    }, {});
  };

  const selectConversation = (senderId) => {
    setActiveConversationId(senderId); 
    markMessagesAsRead(conversations[senderId].messages);
  };

  const markMessagesAsRead = async (messages) => {
    const unreadMessages = messages.filter(m => !m.is_read && m.receiver_id === currentUserId);
    if (unreadMessages.length > 0) {
      await axios.patch(`/api/messages/read`, {
        messageIds: unreadMessages.map(m => m.id)
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      fetchMessages(); // re-fetch messages to update the state after marking as read
    }
  };

  return (
    <div className="message-list-container">
      {error && <p className="error">{error}</p>}
      <div className="senders-list">
        {Object.keys(conversations).map((senderId) => (
          <div key={senderId} onClick={() => selectConversation(senderId)} className={`sender-name ${conversations[senderId].unread ? 'unread' : ''} ${activeConversationId === senderId ? 'active' : ''}`}>
            {conversations[senderId].sender}
            {conversations[senderId].unread && <span className="unread-indicator"> • </span>}
          </div>
        ))}
      </div>
      {activeConversationId && conversations[activeConversationId] && (
        <div className="conversation-view">
          <div className="conversation-header">
            {conversations[activeConversationId].sender}
          </div>
          <div className="messages">
            {conversations[activeConversationId].messages.map((message) => (
              <div key={message.id} className={`message-item ${!message.is_read ? 'unread-message' : ''}`}>
                {message.content}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default MessageList;
