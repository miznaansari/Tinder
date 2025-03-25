import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useLocation } from 'react-router';

const socket = io(`${import.meta.env.VITE_URL}`);

const Chat = () => {
  const location = useLocation();
  const { sender, receiver } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [showAllMessages, setShowAllMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [summary, setSummary] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  useEffect(() => {
    console.log(sender)
    if (!sender || !receiver) {
      console.error('Sender or Receiver information is missing');
      return;
    }
    const user = JSON.parse(localStorage.getItem('user'));

    socket.connect();
    socket.emit('userConnected', user._id, user.name);

    axios.post(`${import.meta.env.VITE_URL}/api/chat/messages`, {
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
    setLoader(true);
    if (!message.trim()) return;

    const user = JSON.parse(localStorage.getItem('user'));
    const senderId = user._id === receiver._id ? receiver._id : sender._id;
    const receiverId = user._id === receiver._id ? sender._id : receiver._id;

    const newMessage = {
      senderId,
      receiverId,
      message,
      timestamp: new Date().toISOString(),
    };

    try {
      await axios.post(`${import.meta.env.VITE_URL}/api/chat/send`, newMessage);
      socket.emit('sendMessage', newMessage);
      setMessages((prev) => [...prev, newMessage]);
      setMessage('');
      setLoader(false);
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

  const generateSummary = async () => {
    try {
      const response = await axios.post(`https://chatbot-onvb.onrender.com/generate-summary`, {
        senderId: sender._id,
        receiverId: receiver._id,
        customPrompt: customPrompt || 'Summarize the following conversation',
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Failed to generate summary.');
    }
  };

  const visibleMessages = showAllMessages ? messages : messages.slice(-15);

  return (
    <div className="flex flex-col w-full md:w-1/3 lg:h-screen pb-10 bg-base-200 text-white p-4">
      <h2 className="text-2xl font-bold mb-4">Chat with {receiver?.name}</h2>
      <input
        type="text"
        value={customPrompt}
        onChange={(e) => setCustomPrompt(e.target.value)}
        placeholder="Enter your custom prompt"
        className="input input-bordered mb-4"
      />
      <button onClick={generateSummary} className="btn btn-success mb-4">Generate Chat Summary</button>
      {summary && <div className="alert alert-info mb-4">{summary}</div>}
      {messages.length > 15 && !showAllMessages && (
        <button onClick={() => setShowAllMessages(true)} className="link mb-4">View Past Messages</button>
      )}
      <div className="flex-1 overflow-auto p-4 rounded-lg">
        {visibleMessages.map((msg, index) => (
          <div key={index} className={`chat ${msg.senderId === sender._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src={msg.senderId === sender._id ? "https://tinder-g832.onrender.com"+sender.profilePicture : "https://tinder-g832.onrender.com"+receiver.profilePicture} alt="avatar"/>
              </div>
            </div>
            <div className="chat-header">
              {msg.senderId === sender._id ? 'You' : receiver?.name} - {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
            <div className="chat-bubble">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex gap-2 mt-4 fixed bottom-0 pb-2 w-full left-0 bg-base-200">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="input input-bordered flex-grow"
        />
        <button onClick={sendMessage} className="btn btn-primary">
          {loader ? <span className="loading loading-spinner loading-xs"></span> : 'Send'}
        </button>
      </div>
    </div>
  );
};

export default Chat;