import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MessageForm({ currentUserId, authToken, role, onMessageSent, showMessageForm, users }) {
  const [receiverId, setReceiverId] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [availableUsers, setAvailableUsers] = useState([]);

  useEffect(() => {
    // Fetch available users when the component mounts
    const fetchAvailableUsers = async () => {
      try {
        const response = await axios.get('/api/users/available', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        // Filter out the current user from the available users
        const filteredUsers = response.data.filter((user) => user.id !== currentUserId);
        setAvailableUsers(filteredUsers);
      } catch (error) {
        console.error('Failed to fetch available users:', error);
      }
    };

    fetchAvailableUsers();
  }, [authToken, currentUserId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
        await axios.post(
            '/api/messages/create',
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
        if (onMessageSent) {
            onMessageSent();
        }
    } catch (error) {
        console.error('Error sending message:', error);
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
        {availableUsers.map((user) => (
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
