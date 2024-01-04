import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './messaging.css';

function MessageList({ currentUserId, authToken, showMessageList }) {
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

      if (currentUserId) {
        fetchMessages();
      }
    }
  }, [currentUserId, authToken, showMessageList]);

  return (
    <div className="message-list-container">
      {error && <p className="error">{error}</p>}
      {showMessageList && (
        <ul className="message-list">
          {messages.map((message) => (
            <li key={message.id} className="message-item">
              From: {message.sender_username}, To: {message.receiver_username} - {message.content}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MessageList;