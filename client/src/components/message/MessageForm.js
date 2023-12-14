import React, { useState, useEffect } from 'react';
import axios from 'axios';

function MessageForm({ currentUserId, authToken, role }) {
  const [receiverId, setReceiverId] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('');
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users/available', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUsers(response.data);
      } catch (error) {
        setStatus('Failed to fetch users.');
      }
    };

    fetchUsers();
  }, [authToken]);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/messages', {
        receiver_id: receiverId,
        content: content,
      }, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.status === 201) {
        setStatus('Message sent successfully');
        setReceiverId('');
        setContent('');
      }
    } catch (error) {
      setStatus(error.response && error.response.data.msg ? error.response.data.msg : 'Failed to send message. Please try again.');
    }
  };

  return (
    <div>
      <form onSubmit={sendMessage}>
        {role === 'trainer' && (
          <select
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            required
          >
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        )}
        {role === 'client' && (
          <input
            type="text"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
            placeholder="Trainer ID"
            required
          />
        )}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Message Content"
          required
        />
        <button type="submit">Send Message</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default MessageForm;
