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
        const response = await axios.get('/api/users/available', { // Make sure the endpoint is correct
          headers: { Authorization: `Bearer ${authToken}` },
        });
        // If the current user is a client, filter out only trainers from the response
        if (role === 'client') {
          setUsers(response.data.filter(user => user.role === 'trainer'));
        } else {
          // If the user is a trainer, they can message anyone
          setUsers(response.data);
        }
      } catch (error) {
        setStatus('Failed to fetch users.');
      }
    };
    if (currentUserId && authToken) {
      fetchUsers();
    }
  }, [authToken, currentUserId, role]);

  const sendMessage = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/messages', {
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
      const errorMessage = error.response && error.response.data
        ? error.response.data.message || error.response.data.error
        : 'Failed to send message. Please try again.';
      setStatus(errorMessage);
    }
  };
  
  return (
    <div>
      <form onSubmit={sendMessage}>
        {role === 'trainer' && (
          <select value={receiverId} onChange={(e) => setReceiverId(e.target.value)} required>
            <option value="">Select a user</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        )}
        {role === 'client' && (
          <select value={receiverId} onChange={(e) => setReceiverId(e.target.value)} required>
            <option value="">Select a trainer</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>{user.username}</option>
            ))}
          </select>
        )}
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Message Content" required />
        <button type="submit">Send Message</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default MessageForm;
