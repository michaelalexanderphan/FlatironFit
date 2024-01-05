import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { toast } from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for the back button
import '../../styling/Login.css';

function Login() {
  const { login } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!username || !password) {
      toast.error('Please enter both username and password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', { username, password });
      console.log('User:', response.data.user); // Log the user object
      console.log('Access Token:', response.data.access_token); // Log the access token
      login(response.data.user, response.data.access_token);
      navigate('/dashboard');
      toast.success('Logged in successfully!');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Login failed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="row justify-content-center align-items-center min-vh-100">
        <div className="col-md-6">
          <div className="card p-4 login-box">
            <h2 className="text-center mb-4 welcome-heading">Login</h2>
            <form onSubmit={handleLogin} className="login-form">
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
              <div className="d-flex justify-content-between align-items-center">
                <button type="submit" disabled={isLoading} className="btn btn-primary login-button">
                  {isLoading ? 'Logging in...' : 'Log In'}
                </button>
                <Link to="/" className="btn btn-secondary back-button">Back</Link> {/* Back button */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
