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
      try {
        const response = await axios.get('/api/messages/unread/count', {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        setUnreadMessagesCount(response.data.count);
      } catch (error) {
        console.error('Failed to fetch unread messages count.');
      }
    };

    if (authToken) {
      fetchUnreadMessagesCount();
    }
  }, [authToken]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let usersResponse;

        if (user?.role === 'trainer') {
          // Trainers can message all users
          usersResponse = await axios.get('/api/users/available', {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        } else if (user?.role === 'client') {
          // Clients can only message trainers
          usersResponse = await axios.get('/api/users/trainers', {
            headers: { Authorization: `Bearer ${authToken}` },
          });
        }

        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Failed to fetch users.');
      }
    };

    if (authToken && showMessageForm) {
      fetchUsers();
    }
  }, [authToken, showMessageForm, user?.role]);

  const toggleMessageForm = () => {
    setShowMessageForm(!showMessageForm);
  };

  const toggleMessageList = () => {
    setShowMessageList(!showMessageList);
  };

  const handleOpenInbox = async () => {
    try {
      const response = await axios.get('/api/messages', {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const messages = response.data;
      setFetchedMessages(messages);
    } catch (error) {
      console.error('Failed to fetch messages.', error);
    }

    navigate('/dashboard/messaging');
  };

  return (
    <div>
      <h1>Flatiron Fit Flow</h1>
      <h2>Welcome, {user ? user.username : 'Guest'}!</h2>
      <Navbar />
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<UserProfile />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="profile/edit" element={<UserProfileEdit />} />
          <Route path="workout-plans" element={<WorkoutPlans />} />
          <Route path="workout-detail/:workoutId" element={<WorkoutDetail />} />
          <Route path="exercises" element={<Exercises />} />
          <Route
            path="messaging"
            element={
              <>
                <button className="btn-show-messages" onClick={toggleMessageForm}>
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
                  <div key={message.id}>
                    <p>From: {message.sender_username}</p>
                    <p>To: {message.receiver_username}</p>
                    <p>{message.content}</p>
                  </div>
                ))}
              </>
            }
          />
        </Route>
      </Routes>
      <button className="btn-inbox" onClick={handleOpenInbox}>
        Inbox {unreadMessagesCount > 0 && <span className="unread-count">{unreadMessagesCount}</span>}
      </button>
    </div>
  );
}

export default Dashboard;
