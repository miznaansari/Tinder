import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import { useOnlineStatus } from './OnlineStatusContext';

const Acceptedfriendlist = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const onlineUsers = useOnlineStatus();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.post(`${import.meta.env.VITE_URL}/api/friend-requests/accepted`, { id: user._id });

        if (response.data.success) {
          response.data.data = response.data.data.map((item) => {
            if (item.receiver._id === user._id) {
              const temp = item.receiver;
              item.receiver = item.sender;
              item.sender = temp;
            }
            return item;
          });
          setFriends(response.data.data);
        } else {
          console.error('Failed to fetch friends:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching friends:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFriends();
  }, []);

  const handleChat = (friend) => {
    navigate('/chat', { state: { sender: friend.sender, receiver: friend.receiver } });
  };

  return (
    <ul className="list bg-base-200 text-base-content rounded-box shadow-md w-full md:w-1/2 lg:w-1/3">
      <div className='flex justify-between items-center p-4'>
        <span className="text-xs opacity-60 tracking-wide">Accepted Friends List</span>
        <Link to="/pendingrequest" className="text-xs opacity-60 tracking-wide">Pending Requests</Link>
      </div>

      {loading ? (
        Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex w-full flex-col gap-4 p-2">
            <div className="skeleton h-20 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        ))
      ) : (
        friends.map((friend) => (
          <li key={friend._id} className="list-row cursor-pointer hover:bg-base-300 p-2 rounded-md" onClick={() => handleChat(friend)}>
            <div className="flex items-center space-x-4">
              <div className="avatar indicator">
                {onlineUsers.get(friend.receiver._id) ? (
                  <span className="indicator-item badge badge-success">Online</span>
                ) : (
                  <span className="indicator-item badge badge-error">Offline</span>
                )}
                <div className="h-20 w-20 rounded-lg">
                  <img 
                    src={friend?.receiver?.profilePicture 
                      ? `import.meta.env.VITE_URL${friend.receiver.profilePicture}` 
                      : 'https://via.placeholder.com/256'} 
                    alt={friend?.receiver?.name || 'User'} 
                  />
                </div>
              </div>
              <div>
                <div className="font-semibold">{friend?.receiver?.name}</div>
                <div className="text-xs uppercase font-semibold opacity-60">{friend?.receiver?.email}</div>
              </div>
            </div>
          </li>
        ))
      )}
    </ul>
  );
};

export default Acceptedfriendlist;
