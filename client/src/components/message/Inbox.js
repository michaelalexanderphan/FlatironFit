import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MessageModal from './MessageModal'; // Import the MessageModal component

function Inbox({ currentUserId, authToken }) {
  const [showMessageList, setShowMessageList] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
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

    if (showMessageList) {
      fetchMessages();
    }
  }, [authToken, showMessageList]);

  const openMessageList = () => {
    setShowMessageList(true);
  };

  const closeMessageList = () => {
    setShowMessageList(false);
  };

  return (
    <div className="inbox-container">
      {error && <p className="error">{error}</p>}
      <button className="btn-send-message" onClick={openMessageList}>
        Open Inbox
      </button>
      <MessageModal isOpen={showMessageList} onClose={closeMessageList} messages={messages} />
    </div>
  );
}

export default Inbox;
