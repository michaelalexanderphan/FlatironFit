import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [bio, setBio] = useState('');
  const [role, setRole] = useState('client');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!username || !email || !password || (role === 'trainer' && secretCode !== 'trainer')) {
      setError('Please fill in all fields correctly');
      return;
    }

    setIsLoading(true);
    try {
      setError('');
      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('contactInfo', contactInfo);
      formData.append('bio', bio);
      formData.append('role', role);
      if (role === 'trainer') {
        formData.append('secret_code', secretCode);
      }

      const response = await axios.post('/api/auth/register', formData);
      setIsLoading(false);

      if (response.status === 201) {
        navigate('/login');
      } else {
        setError('Signup failed');
      }
    } catch (err) {
      setIsLoading(false);
      setError(err.response && err.response.data.msg ? err.response.data.msg : 'Signup failed. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        {error && <p className="error">{error}</p>}
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="contactInfo">Contact Information</label>
          <input
            id="contactInfo"
            type="text"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="role">Role</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={isLoading}
          >
            <option value="client">Client</option>
            <option value="trainer">Trainer</option>
          </select>
        </div>
        {role === 'trainer' && (
          <div>
            <label htmlFor="secretCode">Secret Code for Trainer</label>
            <input
              id="secretCode"
              type="text"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              disabled={isLoading}
              placeholder="Enter secret code"
            />
          </div>
        )}
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default Signup;
