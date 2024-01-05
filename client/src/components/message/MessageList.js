import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './messaging.css';

function MessageList({ currentUserId, authToken, showMessageList, setUnreadMessagesCount }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (showMessageList) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get('/api/messages', {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setMessages(response.data);
        } catch (error) {
          setError('Failed to fetch messages.');
        }
      };

      fetchMessages();
    }
  }, [authToken, showMessageList]);

  const markAsRead = async (messageId) => {
    try {
      await axios.patch(`/api/messages/${messageId}`, {}, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      setMessages(prevMessages => prevMessages.map(message => 
        message.id === messageId ? { ...message, is_read: true } : message
      ));
    
      setUnreadMessagesCount(prevCount => Math.max(prevCount - 1, 0)); 
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <div className="message-list-container">
      {error && <p className="error">{error}</p>}
      {showMessageList && (
        <ul className="message-list">
          {messages.map((message) => (
            <li 
              key={message.id} 
              className={`message-item ${!message.is_read ? 'unread-message' : ''}`}
              onClick={() => !message.is_read && markAsRead(message.id)}
            >
              From: {message.sender_username}, To: {message.receiver_username} - {message.content}
              {!message.is_read && <span className="unread-indicator">(unread)</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MessageList;
