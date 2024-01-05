import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import './UserProfile.css';

function UserProfile() {
  const { user: currentUser, token } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [formData, setFormData] = useState({
    contact_info: '',
    bio: '',
  });
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // State to control editing mode

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`/api/users/${currentUser.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        setProfileData(response.data);

        // Set form data with user's current data
        setFormData({
          contact_info: response.data.contact_info || '',
          bio: response.data.bio || '',
        });
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [currentUser.id, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(`/api/users/${currentUser.id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      });
      setProfileData(response.data);
      setIsEditing(false); // Disable editing mode after a successful update
      toast.success('Profile updated successfully!', { duration: 3000 });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Profile update failed. Please try again later.');
    }
  };

  const handleCancel = () => {
    // Reset the form data to the current user's data
    setFormData({
      contact_info: profileData.contact_info || '',
      bio: profileData.bio || '',
    });
    setIsEditing(false); // Disable editing mode on cancel
  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      {profileData.id === currentUser.id ? (
        <>
          <p><strong>Username:</strong> {profileData.username}</p>
          <p><strong>Email:</strong> {profileData.email}</p>
          <p><strong>Contact Info:</strong> {profileData.contact_info}</p>
          <p><strong>Bio:</strong> {profileData.bio}</p>
          {!isEditing && <button onClick={handleEditClick}>Edit Profile</button>}
        </>
      ) : (
        <>
          <p><strong>Username:</strong> {profileData.username}</p>
          <p><strong>Contact Info:</strong> {profileData.contact_info}</p>
          <p><strong>Bio:</strong> {profileData.bio}</p>
        </>
      )}
      {currentUser.id === profileData.id && isEditing && (
        <div>
          <h2>Edit Profile</h2>
          <form onSubmit={handleSubmit}>
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
      )}
    </div>
  );
}

export default UserProfile;
