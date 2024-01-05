// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import MessageModal from './MessageModal';

// function Inbox({ authToken }) {
//   const [showMessageList, setShowMessageList] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     const fetchUnreadMessagesCount = async () => {
//       try {
//         const response = await axios.get('/api/messages/unread/count', {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
//         setUnreadMessagesCount(response.data.unread_count);
//       } catch (error) {
//         console.error('Failed to fetch unread messages count:', error.response || error);
//       }
//     };

//     fetchUnreadMessagesCount();
//   }, [authToken]); 

//   useEffect(() => {
//     const fetchMessages = async () => {
//       try {
//         const response = await axios.get('/api/messages', {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
//         setMessages(response.data);
//       } catch (error) {
//         setError('Failed to fetch messages:', error.response || error);
//       }
//     };

//     if (showMessageList) {
//       fetchMessages();
//     }
//   }, [authToken, showMessageList]);

//   const openMessageList = () => {
//     setShowMessageList(true);
//   };

//   const closeMessageList = () => {
//     setShowMessageList(false);
//     fetchUnreadMessagesCount(); // Update the count after closing the message list
//   };

//   return (
//     <div className="inbox-container">
//       {error && <p className="error">{error}</p>}
//       <button className="btn-send-message" onClick={openMessageList}>
//         Open Inbox {unreadMessagesCount > 0 ? `(${unreadMessagesCount})` : ''}
//       </button>
//       <MessageModal isOpen={showMessageList} onClose={closeMessageList} messages={messages} />
//     </div>
//   );
// }

// export default Inbox;
