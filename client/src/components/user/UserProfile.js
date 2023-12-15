import React, { useState, useEffect, useContext } from 'react';
import api from '../../axiosConfig.js';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function UserProfile() {
  const [user, setUser] = useState({ username: '', email: '', contact_info: '', bio: '' });
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const fetchUser = async () => {
      if (!currentUser || !currentUser.id) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await api.get(`/users/${currentUser.id}`);
        setUser(response.data);
      } catch (error) {
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [currentUser, navigate]);

  const handleEditProfile = () => {
    navigate('/dashboard/profile/edit');
  };

  if (isLoading) {
    return <div>Loading profile...</div>;
  }

  if (!user) {
    return <div>User profile not found.</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Contact Info:</strong> {user.contact_info}</p>
      <p><strong>Bio:</strong> {user.bio}</p>
      <button onClick={handleEditProfile}>Edit Profile</button>
    </div>
  );
}

export default UserProfile;
