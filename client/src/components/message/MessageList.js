import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MessageList({ currentUserId, authToken }) {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/messages', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        // Filter messages to only those where the current user is the receiver or sender
        const relevantMessages = response.data.filter(m => m.receiver_id === currentUserId || m.sender_id === currentUserId);
        setMessages(relevantMessages);
      } catch (error) {
        setError(error.response && error.response.data.message ? error.response.data.message : 'Failed to fetch messages.');
      }
    };

    if (currentUserId) {
      fetchMessages();
    }
  }, [currentUserId, authToken]);

  return (
    <div>
      {error && <p className="error">{error}</p>}
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            From: {message.sender_id}, To: {message.receiver_id} - {message.content}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MessageList;
