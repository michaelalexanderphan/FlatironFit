import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword } from '../utils/validations';
import '../../styling/Signup.css';
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
    <div className="signup-container"> {/* Updated class name */}
      <div className="signup-card">
        <h2 className="signup-heading text-center mb-4">Signup</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="contactInfo" className="form-label">Contact Info</label>
            <input
              id="contactInfo"
              type="text"
              value={contactInfo}
              onChange={(e) => setContactInfo(e.target.value)}
              disabled={isLoading}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="bio" className="form-label">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              disabled={isLoading}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="role" className="form-label">Role</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={isLoading}
              className="form-select"
            >
              <option value="client">Client</option>
              <option value="trainer">Trainer</option>
            </select>
          </div>
          {role === 'trainer' && (
            <div className="mb-3">
              <label htmlFor="secretCode" className="form-label">Secret Code (for trainers only)</label>
              <input
                id="secretCode"
                type="text"
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
                disabled={isLoading}
                className="form-control"
                placeholder="Enter secret code"
              />
            </div>
          )}
          <button type="submit" disabled={isLoading} className="signup-button">
            {isLoading ? 'Signing up...' : 'Sign Up'}
          </button>
          <Link to="/" className="btn btn-secondary ms-2">Back</Link>
        </form>
        {error && <p className="text-danger mt-3">{error}</p>}
      </div>
    </div>
  );
  
}

export default Signup;

