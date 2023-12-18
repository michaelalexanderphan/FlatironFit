import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

function UserProfile() {
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!currentUser) {
    navigate('/login');
    return <div>Redirecting to login...</div>;
  }

  const handleEditProfile = () => {
    navigate('/dashboard/profile/edit');
  };

  return (
    <div>
      <h2>User Profile</h2>
      <p><strong>Username:</strong> {currentUser.username}</p>
      <p><strong>Email:</strong> {currentUser.email}</p>
      <p><strong>Contact Info:</strong> {currentUser.contact_info}</p>
      <p><strong>Bio:</strong> {currentUser.bio}</p>
      <button onClick={handleEditProfile}>Edit Profile</button>
    </div>
  );
}

export default UserProfile;
