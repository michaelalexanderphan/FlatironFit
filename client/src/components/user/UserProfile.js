import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function UserProfile() {
  const [user, setUser] = useState({ username: '', email: '', contact_info: '', bio: '' });
  const [isLoading, setIsLoading] = useState(true);
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    console.log('Effect running: currentUser', currentUser);
    const fetchUser = async () => {
      try {
        console.log('Attempting to fetch user');
        const response = await axios.get(`/api/users/${currentUser.id}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` }
        });
        console.log('User data fetched', response.data);
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user profile', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && currentUser.id) {
      fetchUser();
    } else {
      console.log('Redirecting to login because currentUser is invalid');
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const handleEditProfile = () => {
    navigate('/dashboard/profile/edit');
  };

  if (isLoading) {
    console.log('Loading the user profile...');
    return <div>Loading profile...</div>;
  }

  if (!user) {
    console.log('User not found after loading');
    return <div>User profile not found.</div>;
  }

  console.log('Rendering user profile with data:', user);
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
