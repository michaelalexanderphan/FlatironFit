import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null); // Updated to null
  const [contactInfo, setContactInfo] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      setError('');

      const formData = new FormData();
      formData.append('username', username);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('profileImage', profileImage); // Updated to use the selected file
      formData.append('contactInfo', contactInfo);
      formData.append('bio', bio);

      const response = await axios.post('/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Set content type to multipart/form-data
        },
      });
      setIsLoading(false);

      if (response.status === 201) {
        // Optionally display a success message or perform other actions here
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
        {/* File input for profile image */}
        <div>
          <label htmlFor="profileImage">Profile Image</label>
          <input
            id="profileImage"
            type="file"
            accept="image/*" // Accept image files
            onChange={(e) => setProfileImage(e.target.files[0])} // Update the profileImage state with the selected file
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
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
}

export default Signup;
