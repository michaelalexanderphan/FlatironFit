import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function UserEditForm() {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    contact_info: '',
    bio: ''
  });
  const [errors, setErrors] = useState({});
  const { user: currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/api/users/${currentUser.id}`, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` }
        });
        setUserDetails(response.data);
      } catch (error) {
        console.error('Error fetching user details', error);
      }
    };

    if (currentUser && currentUser.id) {
      fetchUserDetails();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};
    
    if (!validateEmail(userDetails.email)) {
      validationErrors.email = 'Invalid email format';
    }

    if (Object.keys(validationErrors).length === 0) {
      try {
        await axios.put(`/api/users/${currentUser.id}`, userDetails, {
          headers: { Authorization: `Bearer ${sessionStorage.getItem('authToken')}` }
        });
        navigate('/dashboard/profile');
      } catch (error) {
        console.error('Error updating user details', error);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div>
      <h2>Edit Profile</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="username"
          value={userDetails.username}
          onChange={handleChange}
          placeholder="Username"
        />
        {errors.username && <p className="error">{errors.username}</p>}
        <input
          name="email"
          value={userDetails.email}
          onChange={handleChange}
          placeholder="Email"
        />
        {errors.email && <p className="error">{errors.email}</p>}
        <input
          name="contact_info"
          value={userDetails.contact_info}
          onChange={handleChange}
          placeholder="Contact Information"
        />
        <textarea
          name="bio"
          value={userDetails.bio}
          onChange={handleChange}
          placeholder="Bio"
        />
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default UserEditForm;
