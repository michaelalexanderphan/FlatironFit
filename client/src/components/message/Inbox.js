import React, { useState } from 'react';
import './messaging.css'; // Import your CSS file
import MessageForm from './MessageForm';
import MessageList from './MessageList';

function Inbox({ currentUserId, authToken, role }) {
  const [showMessageForm, setShowMessageForm] = useState(false);

  const handleSendMessage = () => {
    setShowMessageForm(false);
  };

  return (
    <div className="inbox-container">
      <button className="btn-send-message" onClick={() => setShowMessageForm(true)}>Send Message</button>
      {showMessageForm && (
        <MessageForm
          currentUserId={currentUserId}
          authToken={authToken}
          role={role}
          onMessageSent={handleSendMessage}
        />
      )}
      <MessageList
        currentUserId={currentUserId}
        authToken={authToken}
      />
    </div>
  );
}

export default Inbox;
