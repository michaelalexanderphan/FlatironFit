import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../axiosConfig';
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

  // Populate form with current user data on component mount
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        contact_info: user.contact_info || '',
        bio: user.bio || '',
      });
    } else {
      navigate('/login'); // Redirect to login if there is no user in context
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
      const response = await api.patch(`/users/${user.id}`, formData);
      setUser(response.data); // Update user in context with new data
      navigate('/dashboard/profile/'); // Navigate back to the profile page
    } catch (error) {
      console.error('Error updating profile:', error);
      // Here you can set an error message in the state and display it to the user if needed
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="contact_info">Contact Info:</label>
          <input
            type="text"
            id="contact_info"
            name="contact_info"
            value={formData.contact_info}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="bio">Bio:</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default UserProfileEdit;
