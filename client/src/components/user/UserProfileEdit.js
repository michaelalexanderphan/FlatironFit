import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserProfileEdit() {
  const authContext = useContext(AuthContext);
  const { user, setUser } = authContext;
  const token = authContext.token; 

  const [formData, setFormData] = useState({ 
    username: '',
    email: '',
    contact_info: '',
    bio: '',
  });
  const navigate = useNavigate();
  const [usernameError, setUsernameError] = useState(null);
  const [emailError, setEmailError] = useState(null);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        contact_info: user.contact_info || '',
        bio: user.bio || '',
      });
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    if (name === 'username') {
      setUsernameError(null);
    } else if (name === 'email') {
      setEmailError(null);
    }
  };

  const isUsernameValid = async (username) => {
    try {
      const response = await axios.get(`/api/users/check-username?username=${username}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.available;
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  const isEmailValid = async (email) => {
    try {
      const response = await axios.get(`/api/users/check-email?email=${email}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data.available;
    } catch (error) {
      console.error('Error checking email availability:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isUsernameAvailable = await isUsernameValid(formData.username);
    const isEmailAvailable = await isEmailValid(formData.email);

    if (!isUsernameAvailable) {
      setUsernameError('Username is already taken.');
      return;
    }

    if (!isEmailAvailable) {
      setEmailError('Email is already in use.');
      return;
    }

    try {
      const response = await axios.patch(`/api/users/${user.id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      setUser(response.data);
      navigate('/dashboard/profile/');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    navigate('/dashboard/profile/');
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        {usernameError && <p>{usernameError}</p>}
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        {emailError && <p>{emailError}</p>}
        <input
          type="text"
          id="contact_info"
          name="contact_info"
          value={formData.contact_info}
          onChange={handleChange}
        />
        <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
        <button type="submit">Save Changes</button>
        <button type="button" onClick={handleCancel}>Cancel</button>
      </form>
    </div>
  );
}

export default UserProfileEdit;
