import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io(`${import.meta.env.VITE_URL}`);

const ChatDesktop = ({ sender, receiver }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [showAllMessages, setShowAllMessages] = useState(false);
  const messagesEndRef = useRef(null);
  const [loader, setLoader] = useState(false);
  const [chatLoader, setChatLoader] = useState(false);
  const [summary, setSummary] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');

  useEffect(() => {
    if (!sender || !receiver) {
      return;
    }

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?._id) {
      return;
    }

    socket.connect();
    socket.emit('userConnected', user._id, user.name);

    axios
      .post(`${import.meta.env.VITE_URL}/api/chat/messages`, {
        senderId: sender._id,
        receiverId: receiver._id,
      })
      .then((res) => setMessages(res.data.messages))
      .catch(() => setMessages([]));

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
    if (!message.trim()) {
      return;
    }

    setLoader(true);

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user?._id) {
      setLoader(false);
      return;
    }

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
    } catch {
      // Keep UI stable on send failure.
    } finally {
      setLoader(false);
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
      setChatLoader(true);
      const response = await axios.post(`https://chatbot-onvb.onrender.com/generate-summary`, {
        senderId: sender._id,
        receiverId: receiver._id,
        customPrompt: customPrompt || 'Summarize the following conversation',
      });
      setSummary(response.data.summary);
    } catch {
      setSummary('Failed to generate summary.');
    } finally {
      setChatLoader(false);
    }
  };

  const visibleMessages = showAllMessages ? messages : messages.slice(-15);
  const avatarFor = (id) => {
    if (id === sender?._id) {
      return sender?.profilePicture ? `${import.meta.env.VITE_URL}${sender.profilePicture}` : 'https://via.placeholder.com/64';
    }

    return receiver?.profilePicture ? `${import.meta.env.VITE_URL}${receiver.profilePicture}` : 'https://via.placeholder.com/64';
  };

  return (
    <div className="relative flex h-[78dvh] w-full flex-col overflow-hidden bg-base-200 text-base-content">
      <div className="border-b border-base-300/70 bg-base-100 p-3">
        <h2 className="text-lg font-extrabold tracking-tight">Chat with {receiver?.name}</h2>
        <p className="text-xs uppercase tracking-wide text-base-content/55">Desktop conversation panel</p>
      </div>

      <div className="flex flex-col gap-2 border-b border-base-300/60 bg-base-100/80 p-3">
        <div className="flex flex-col gap-2 lg:flex-row">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Enter custom summary prompt"
            className="input input-bordered h-11 w-full text-base"
          />
          <button onClick={generateSummary} className="btn btn-success h-11 px-4 lg:w-auto">
            {chatLoader ? (
              <>
                <span className="loading loading-dots loading-xs" /> Waiting...
              </>
            ) : (
              'Generate Summary'
            )}
          </button>
        </div>

        {summary && <div className="alert alert-info text-sm">{summary}</div>}

        {messages.length > 15 && !showAllMessages && (
          <button onClick={() => setShowAllMessages(true)} className="link text-sm">
            View Past Messages
          </button>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-auto p-4">
        {visibleMessages.map((msg, index) => (
          <div key={msg._id || `${msg.timestamp}-${index}`} className={`chat ${msg.senderId === sender._id ? 'chat-end' : 'chat-start'}`}>
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <img src={avatarFor(msg.senderId)} alt="avatar" />
              </div>
            </div>
            <div className="chat-header">
              {msg.senderId === sender._id ? 'You' : receiver?.name} - {new Date(msg.timestamp).toLocaleTimeString()}
            </div>
            <div className="chat-bubble">{msg.message}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-base-300/60 bg-base-100 p-3">
        <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="input input-bordered h-12 flex-grow text-base"
        />

        <button onClick={sendMessage} className="btn btn-primary h-12 px-5 text-base">
          {loader ? <span className="loading loading-spinner loading-xs" /> : 'Send'}
        </button>
        </div>
      </div>
    </div>
  );
};

export default ChatDesktop;