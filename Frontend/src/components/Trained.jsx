import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Trained = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [feedbacks, setFeedbacks] = useState({});
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveEmail = () => {
    if (!email.trim()) {
      alert('Please enter a valid email.');
      return;
    }
    localStorage.setItem('userEmail', email);
    alert('Email saved. You can now start chatting!');
  };

  const sendMessage = async () => {
    setLoading(true);
    const storedEmail = localStorage.getItem('userEmail');
    if (!storedEmail) {
      alert('Please provide your email first.');
      return;
    }
    if (!message.trim()) return;

    try {
      const res = await axios.post('https://chatbot-onvb.onrender.com/chat', {
        email: storedEmail,
        message,
      });
      const newMessage = { sender: 'You', message };
      const botResponse = { sender: 'Bot', message: res.data.response };

      setMessages((prev) => [...prev, newMessage, botResponse]);
    setLoading(false);

      setMessage('');
    } catch (error) {
    setLoading(false);

      console.error('Error sending message:', error);
    }
  };

  const sendFeedback = async (msg) => {
    const feedback = feedbacks[msg] || '';
    if (!feedback.trim()) return;

    try {
      await axios.post('http://127.0.0.1:5000/feedback', {
        message: msg,
        correct_response: feedback,
        email: localStorage.getItem('userEmail'),
      });
      alert('Feedback submitted!');
      setFeedbacks((prev) => ({ ...prev, [msg]: '' }));
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col w-full bg-base-200 text-white p-4 mb-10">
      <h2 className="text-2xl font-bold mb-4 text-base-content">Trained Chatbot</h2>

      {/* Email Input */}
      <div className="mb-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email..."
          className="input input-bordered mr-2"
        />
        <button onClick={saveEmail} className="btn btn-primary">Save Email</button>
      </div>

      <div className="flex-1 overflow-auto bg-base-200 p-4 rounded-lg shadow-md mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`chat ${msg.sender === 'You' ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-header text-base-content">{msg.sender}</div>
            <div className="chat-bubble">{msg.message}</div>
            {msg.sender === 'Bot' && (
              <div className="mt-2">
              </div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div className='flex bg-base-200 fixed bottom-0 p-3 left-0 w-full'>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="p-2 border w-8/10 text-base-content bg-base-200 border border-base-900 rounded-lg"
        />
        <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-lg fixed bottom-3 w-2/10 right-0 ml-2">{!loading?"Send":<span className="loading loading-spinner loading-xs"></span>}</button>
      </div>
    </div>
  );
};

export default Trained;
