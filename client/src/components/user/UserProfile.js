import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function UserProfile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/users/${currentUser.id}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && currentUser.id) {
      fetchUser();
    }
  }, [currentUser]);

  const handleEditProfile = () => {
    navigate('/dashboard/profile/edit');
  };

  if (isLoading) return <div>Loading profile...</div>;
  if (!user) return <div>User profile not found.</div>;

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
