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
  const [showAllMessages, setShowAllMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const [loader, setloader] = useState(false)

  useEffect(() => {
    if (!sender || !receiver) {
      console.error('Sender or Receiver information is missing');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));

    socket.connect();
    socket.emit('userConnected', user._id);

    axios.post('https://tinder-g832.onrender.com/api/chat/messages', {
      senderId: sender._id,
      receiverId: receiver._id,
    })
    .then(res => setMessages(res.data.messages))
    .catch(err => console.error('Error fetching messages:', err));

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
    setloader(true);
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
    setloader(false);

    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const visibleMessages = showAllMessages ? messages : messages.slice(-15);

  return (
    <div className="flex flex-col w-full md:w-1/3 lg:h-screen bg-gray-900 text-white p-4 mb-10">
      <h2 className="text-2xl font-bold mb-4">Chat with {receiver?.name}</h2>
      {messages.length > 15 && !showAllMessages && (
        <button 
          onClick={() => setShowAllMessages(true)} 
          className="mb-2 text-blue-500 underline"
        >
          View Past Messages
        </button>
      )}
      <div className="flex-1 overflow-auto bg-gray-800 p-4 rounded-lg shadow-md mb-4">
        {visibleMessages.map((msg, index) => (
          <div key={index} className={`chat ${msg.senderId === sender._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" alt="avatar" />
              </div>
            </div>
            <div className="chat-header">
              {msg.senderId === sender._id ? 'You' : receiver?.name}
              <time className="text-xs opacity-50">{new Date().toLocaleTimeString()}</time>
            </div>
            <div className="chat-bubble bg-gray-700">{msg.message}</div>
            <div className="chat-footer opacity-50">{msg.senderId === sender._id ? 'Delivered' : 'Seen'}</div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex items-center gap-2">
        
      </div>
      <div className='flex bg-gray-900 fixed bottom-0 p-3 left-0  w-full'>
      <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className=" p-2 border w-8/10 text-white bg-gray-700 border-gray-600 rounded-lg"
        />
      <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg fixed bottom-3 w-2/10 right-0 ml-2  ">{loader?(<span className="loading loading-spinner loading-xs"></span>):'Send'} </button>
      </div>
    </div>
    
  );
};

export default Chat;