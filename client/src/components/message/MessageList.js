import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './messaging.css';

function MessageList({ currentUserId, authToken }) {
  const [conversations, setConversations] = useState({});
  const [selectedConversation, setSelectedConversation] = useState(null);
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
    setSelectedConversation(conversations[senderId]);
    setConversations((prev) => ({
      ...prev,
      [senderId]: { ...prev[senderId], unread: false },
    }));
    markMessagesAsRead(conversations[senderId].messages);
  };

  const markMessagesAsRead = async (messages) => {
    for (let message of messages) {
      if (!message.is_read && message.receiver_id === currentUserId) {
        await axios.patch(`/api/messages/${message.id}`, {}, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
      }
    }
    fetchMessages();
  };

  return (
    <div className="message-list-container">
      {error && <p className="error">{error}</p>}
      <div className="senders-list">
        {Object.keys(conversations).map((senderId) => (
          <div key={senderId} onClick={() => selectConversation(senderId)} className="sender-name">
            {conversations[senderId].sender}
            {conversations[senderId].unread && <span className="unread-indicator">(unread)</span>}
          </div>
        ))}
      </div>
      {selectedConversation && (
        <div className="conversation-view">
          <div className="conversation-header">
            {selectedConversation.sender}
          </div>
          <div className="messages">
            {selectedConversation.messages.map((message) => (
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
