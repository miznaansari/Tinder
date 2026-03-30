import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import { useOnlineStatus } from './OnlineStatusContext';
import { motion } from 'framer-motion';
import ChatDesktop from './chatDesktop';

const Acceptedfriendlist = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingRequest, setPendingRequest] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const [open, setOpen] = useState(false);
  const [sender, setSender] = useState(null);
  const [receiver, setReceiver] = useState(null);
  const [selectedFriendId, setSelectedFriendId] = useState(null);

  const navigate = useNavigate();
  const onlineUsers = useOnlineStatus();

  const currentUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  })();

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser?._id) {
        setErrorMessage('Please log in to view your friends.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setErrorMessage('');

      try {
        const [pendingRes, acceptedRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_URL}/api/friend-requests/${currentUser._id}`),
          axios.post(`${import.meta.env.VITE_URL}/api/friend-requests/accepted`, { id: currentUser._id }),
        ]);

        const filteredRequests = pendingRes.data.data.filter(
          (request) => request.sender?._id !== currentUser._id && request.status !== 1,
        );
        setPendingRequest(filteredRequests.length);

        if (acceptedRes.data.success) {
          const normalizedFriends = acceptedRes.data.data.map((item) => {
            if (item.receiver._id === currentUser._id) {
              const temp = item.receiver;
              item.receiver = item.sender;
              item.sender = temp;
            }

            return item;
          });

          setFriends(normalizedFriends);
        } else {
          setErrorMessage('Failed to fetch friends list.');
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Error fetching friends. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser?._id]);

  const handleChat = (friend) => {
    setSelectedFriendId(friend._id);

    if (window.innerWidth <= 768) {
      navigate('/chat', { state: { sender: friend.sender, receiver: friend.receiver } });
      return;
    }

    setOpen(true);
    setSender(friend.sender);
    setReceiver(friend.receiver);
  };

  return (
    <section className="rounded-2xl border border-base-300/70 bg-base-100 shadow-lg">
      <div className="flex items-center justify-between border-b border-base-300/60 p-3 sm:p-4">
        <div>
          <h2 className="text-sm font-extrabold tracking-tight sm:text-base">Accepted Friends</h2>
          <p className="text-[11px] uppercase tracking-wider text-base-content/55 sm:text-xs">Start conversations with your connections</p>
        </div>

        <Link to="/pendingrequest" className="btn btn-sm rounded-full border border-base-300/70 bg-base-100 text-xs font-semibold normal-case">
          Pending Requests
          <span className="badge badge-primary badge-sm">{pendingRequest}</span>
        </Link>
      </div>

      {errorMessage && (
        <div className="px-4 pt-3">
          <div className="alert alert-error text-sm">{errorMessage}</div>
        </div>
      )}

      <div className="flex h-[78dvh] w-full overflow-hidden">
        <ul className="w-full overflow-auto border-r border-base-300/60 bg-base-200/50 md:w-1/3">
          <li className="cursor-pointer border-b border-base-300/60 p-3 transition-colors hover:bg-base-300/40" onClick={() => navigate('/train')}>
            <div className="flex items-center gap-3">
              <img className="h-11 w-11 rounded-xl" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAdVBMVEX////5+Pzi4vKztuC0u+JpdclffM2prdxhdspVfM2cteLFxeZgbsdif85Yg9E6ftC2zeywq9tma8VThtJKitUphdWPvOfo4fHCtN5+bMNxb8ZsestFjNY8kdkmkdoil96bzO/X6/n2+v1RdMsRjdqw0u+dxOoXwiEkAAAAa0lEQVR4AdXLgxHAUAAD0NS27e6/YXEuMsB/5wACkyRwsgxOUcFpOijDtGwQjuv5QYhfUez5SZrln0IqyqpurrLt+mGc5ndZa/ex64ZPeTMWP227NcevMLi6DYTd3j+m7cHtO7hpAjfPENcJ+wwG2aDUGTgAAAAASUVORK5CYII=" alt="Gemini" />
              <div>
                <p className="font-semibold">Gemini AI</p>
                <p className="text-xs uppercase tracking-wide text-base-content/55">Chat with Gemini AI</p>
              </div>
            </div>
          </li>

          {loading ? (
            <div className="space-y-3 p-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="rounded-xl border border-base-300/60 p-3">
                  <div className="skeleton h-14 w-full" />
                </div>
              ))}
            </div>
          ) : friends.length === 0 ? (
            <motion.div
              role="alert"
              className="alert alert-info m-3"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <span>You haven't added any friends yet. Start connecting with people.</span>
            </motion.div>
          ) : (
            friends.map((friend) => (
              <li
                key={friend._id}
                className={`cursor-pointer border-b border-base-300/60 p-3 transition-colors hover:bg-base-300/40 ${selectedFriendId === friend._id ? 'bg-primary/20' : ''}`}
                onClick={() => handleChat(friend)}
              >
                <div className="flex items-center gap-3">
                  <div className="avatar indicator">
                    {onlineUsers.get(friend.receiver._id) ? (
                      <span className="indicator-item badge badge-success badge-sm">Online</span>
                    ) : (
                      <span className="indicator-item badge badge-error badge-sm">Offline</span>
                    )}

                    <div className="h-14 w-14 rounded-xl">
                      <img
                        src={
                          friend?.receiver?.profilePicture
                            ? `${import.meta.env.VITE_URL}${friend.receiver.profilePicture}`
                            : 'https://via.placeholder.com/256'
                        }
                        alt={friend?.receiver?.name || 'User'}
                      />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold">{friend?.receiver?.name}</p>
                    <p className="truncate text-xs uppercase tracking-wide text-base-content/55">{friend?.receiver?.email}</p>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>

        <div className="hidden w-2/3 md:flex">
          {open ? (
            <ChatDesktop sender={sender} receiver={receiver} />
          ) : (
            <div className="grid w-full place-items-center bg-base-200/40 text-base-content/60">
              <p className="text-sm font-semibold uppercase tracking-wider">Select a friend to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Acceptedfriendlist;
