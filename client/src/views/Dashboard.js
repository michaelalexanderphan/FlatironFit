import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Routes, Route, Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import WorkoutPlans from '../components/workout/WorkoutPlans';
import WorkoutDetail from '../components/workout/WorkoutDetail';
import Exercises from '../components/exercise/ExerciseList';
import Messaging from '../components/message/MessageList';
import MessageForm from '../components/message/MessageForm';
import UserProfile from '../components/user/UserProfile';
import UserProfileEdit from '../components/user/UserProfileEdit';
import axios from 'axios';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const authToken = sessionStorage.getItem('authToken');
  const [showMessageForm, setShowMessageForm] = useState(false);
  const [showMessageList, setShowMessageList] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadMessagesCount = async () => {
      if (authToken) {
        try {
          const response = await axios.get('/api/messages/unread/count', {
            headers: { Authorization: `Bearer ${authToken}` },
          });
          setUnreadMessagesCount(response.data.unread_count);
        } catch (error) {
          console.error('Failed to fetch unread messages count.', error);
        }
      }
    };
  
    fetchUnreadMessagesCount();
  }, [authToken]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (authToken) {
        try {
          let usersResponse;
          if (user?.role === 'trainer') {
            usersResponse = await axios.get('/api/users/available', {
              headers: { Authorization: `Bearer ${authToken}` },
            });
          } else if (user?.role === 'client') {
            usersResponse = await axios.get('/api/users/trainers', {
              headers: { Authorization: `Bearer ${authToken}` },
            });
          }
          setUsers(usersResponse.data);
        } catch (error) {
          console.error('Failed to fetch users.', error);
        }
      }
    };

    if (showMessageForm) {
      fetchUsers();
    }
  }, [authToken, showMessageForm, user?.role]);

  const toggleMessageForm = () => setShowMessageForm(!showMessageForm);
  const toggleMessageList = () => setShowMessageList(!showMessageList);

  const handleOpenInbox = async () => {
    navigate('/dashboard/messaging');
    if (authToken) {
      try {
        const response = await axios.get('/api/messages', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setFetchedMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages.', error);
      }
    }
  };

  return (
    <div className="container-fluid">
      <h1 className="display-4 mt-4">Flatiron Fit Flow</h1>
      <h2 className="lead">Welcome, {user ? user.username : 'Guest'}!</h2>
      <Navbar />
      <Routes>
        <Route path="/" element={<Outlet />} />
        <Route path="workout-plans" element={<WorkoutPlans />} />
        <Route path="workout-detail/:workoutId" element={<WorkoutDetail />} />
        <Route path="exercises" element={<Exercises />} />
        <Route path="messaging" element={
          <div>
            <button className="btn btn-primary mb-3" onClick={toggleMessageForm}>
              Send Message
            </button>
            {showMessageList && <Messaging currentUserId={user?.id} authToken={authToken} />}
            {showMessageForm && (
              <MessageForm
                currentUserId={user?.id}
                authToken={authToken}
                onClose={toggleMessageForm}
                role={user?.role}
                users={users}
              />
            )}
            {fetchedMessages.map((message) => (
              <div key={message.id} className="border p-3 mb-3">
                <p className="font-weight-bold">From: {message.sender_username}</p>
                <p className="font-weight-bold">To: {message.receiver_username}</p>
                <p>{message.content}</p>
              </div>
            ))}
          </div>
        } />
        <Route path="profile/*">
          {user && (
            <>
              <Route index element={<UserProfile />} />
              {/* Remove edit profile */}
            </>
          )}
        </Route>
      </Routes>
      <button className="btn btn-primary" onClick={handleOpenInbox}>
        Inbox {unreadMessagesCount > 0 && `(${unreadMessagesCount})`}
      </button>
    </div>
  );
}

export default Dashboard;
