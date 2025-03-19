import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useLocation } from 'react-router';

const socket = io('https://tinder-g832.onrender.com');

const Chat = () => {
  const location = useLocation();
  const { sender, receiver } = location.state || {};
  
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!sender || !receiver) {
      console.error('Sender or Receiver information is missing');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));

    socket.connect();
    socket.emit('userConnected', user._id);

    // Fetch previous messages
    axios.post('https://tinder-g832.onrender.com/api/chat/messages', {
      senderId: sender._id,
      receiverId: receiver._id,
    })
    .then(res => setMessages(res.data.messages))
    .catch(err => console.error('Error fetching messages:', err));

    // Listen for messages
    socket.on('receiveMessage', (data) => {
      if (
        (data.senderId === sender._id && data.receiverId === receiver._id) ||
        (data.senderId === receiver._id && data.receiverId === sender._id)
      ) {
        setMessages((prev) => [...prev, data]);
      }
    });

    return () => {
      socket.off('receiveMessage');
      socket.disconnect();
    };
  }, [sender, receiver]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const senderid = user._id === receiver._id ? receiver._id : sender._id;
    const receiverid = user._id === receiver._id ? sender._id : receiver._id;

    const newMessage = {
      senderId: senderid,
      receiverId: receiverid,
      message,
    };

    try {
      await axios.post('https://tinder-g832.onrender.com/api/chat/send', newMessage);
      socket.emit('sendMessage', newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 p-4">
      <h2 className="text-2xl font-bold mb-4">Chat with {receiver?.name}</h2>
      <div className="flex-1 overflow-auto bg-white p-4 rounded-lg shadow-md mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 p-2 rounded-lg ${msg.senderId === sender._id ? 'bg-blue-500 text-white self-end' : 'bg-gray-300 text-black self-start'}`}>
            <p>{msg.senderId === sender._id ? 'You' : receiver?.name}: {msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-gray-300 rounded-lg"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg">Send</button>
      </div>
    </div>
  );
};

export default Chat;
