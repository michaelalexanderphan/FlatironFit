import React, { useState } from 'react';
// Import your API helper - this is just a placeholder
// import { apiLogin } from '../api';

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    try {
      setError('');
      // Simulated API call
      const result = await apiLogin(username, password); // Replace with your actual API call
      setIsLoading(false);

      if (result.success) {
        onLoginSuccess(result.token); // Pass the token up to the parent component
      } else {
        setError(result.message);
      }
    } catch (err) {
      setIsLoading(false);
      setError('Login failed. Please try again later.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
    </div>
  );
}

// Replace the fake apiLogin function with your actual API call
async function apiLogin(username, password) {
  // This is a fake API call, you should replace it with an actual API call
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'user' && password === 'pass') {
        resolve({ success: true, token: 'fake-jwt-token' });
      } else {
        resolve({ success: false, message: 'Invalid credentials' });
      }
    }, 1000);
  });
}

export default Login;
