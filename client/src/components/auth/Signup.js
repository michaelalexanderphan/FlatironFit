import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validations';

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
    setIsLoading(true);

    if (!validateEmail(email) || !validatePassword(password)) {
      setError('Invalid email or password format');
      setIsLoading(false);
      return;
    }

    if (role === 'trainer' && secretCode !== 'trainer') {
      setError('Invalid secret code for trainer');
      setIsLoading(false);
      return;
    }

    const userData = {
      username,
      email,
      password,
      contact_info: contactInfo,
      bio,
      role,
      ...(role === 'trainer' && { secret_code: secretCode }),
    };

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/register',
        userData,
        config
      );
      if (response.status === 201) {
        navigate('/login');
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed. Please try again later.');
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={isLoading}
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isLoading}
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isLoading}
        />

        <label htmlFor="contactInfo">Contact Info</label>
        <input
          id="contactInfo"
          type="text"
          value={contactInfo}
          onChange={(e) => setContactInfo(e.target.value)}
          disabled={isLoading}
        />

        <label htmlFor="bio">Bio</label>
        <textarea
          id="bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          disabled={isLoading}
        />

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

        {role === 'trainer' && (
          <>
            <label htmlFor="secretCode">Secret Code (for trainers only)</label>
            <input
              id="secretCode"
              type="text"
              value={secretCode}
              onChange={(e) => setSecretCode(e.target.value)}
              disabled={isLoading}
              placeholder="Enter secret code"
            />
          </>
        )}
        <button type="submit" disabled={isLoading}>
          Sign Up
        </button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default Signup;
