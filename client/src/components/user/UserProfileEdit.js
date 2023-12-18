import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UserProfileEdit() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    contact_info: '',
    bio: '',
  });
  const navigate = useNavigate();

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
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`/users/${user.id}`, formData);
      setUser(response.data);
      navigate('/dashboard/profile/');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" id="username" name="username" value={formData.username} onChange={handleChange} required />
        <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        <input type="text" id="contact_info" name="contact_info" value={formData.contact_info} onChange={handleChange} />
        <textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default UserProfileEdit;
