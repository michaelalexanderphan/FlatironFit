import React, { useState } from 'react';
import axios from 'axios';

function MessageForm({ currentUserId, authToken, role, onMessageSent, showMessageForm, users }) {
  const [receiverId, setReceiverId] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        '/api/messages',
        {
          receiver_id: receiverId,
          content: content,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setStatus('Message sent successfully');
      setReceiverId('');
      setContent('');
      onMessageSent();
    } catch (error) {
      setStatus('Failed to send message. Please try again.');
    }
  };

  return (
    <div className="message-form-container">
      <form className="message-form" onSubmit={sendMessage}>
        <select
          className="message-form-select"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          required
        >
          <option value="">Select a user</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.username}
            </option>
          ))}
        </select>
        <textarea
          className="message-form-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Message Content"
          required
        />
        <button className="message-form-submit" type="submit">
          Send Message
        </button>
      </form>
      {status && <p className="message-status">{status}</p>}
    </div>
  );
}

export default MessageForm;
