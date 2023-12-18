import React, { useEffect, useState } from 'react';
import { getMessages } from '../api'; // You'll need to create this API call function

const Messages = () => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages(); // Fetch messages from the backend
      setMessages(data);
    };

    fetchMessages();
  }, []);

  return (
    <div>
      {messages.map(message => (
        <div key={message.id}>
          <p>{message.content}</p>
          {/* ... */}
        </div>
      ))}
    </div>
  );
};

export default Messages;
