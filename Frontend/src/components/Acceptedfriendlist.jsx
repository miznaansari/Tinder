import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';

const Acceptedfriendlist = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.post('https://tinder-g832.onrender.com/api/friend-requests/accepted', { id: user._id });

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
      }
    };

    fetchFriends();
  }, []);

  const handleChat = (friend) => {
    navigate('/chat', { state: { sender: friend.sender, receiver: friend.receiver } });
  };

  return (
    <ul className="list bg-white text-gray-900 rounded-box shadow-md mt-3 w-full md:w-1/2 lg:w-1/3">
<div className='flex justify-between items-center p-1'>
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">Accepted Friends List</li>
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide"><Link to="/pendingrequest"> Pending Request</Link></li>
      </div>
      {friends.map((friend) => (
        <li key={friend._id} className="list-row cursor-pointer" onClick={() => handleChat(friend)}>
          <div className="flex items-center space-x-4">
            <img className="size-10 rounded-box" src={friend?.receiver?.profilePicture || 'https://via.placeholder.com/256'} alt={friend.receiver.name} />
            <div>
              <div className="font-semibold">{friend.receiver.name}</div>
              <div className="text-xs uppercase font-semibold opacity-60">{friend.receiver.email}</div>
            </div>
          </div>
          
        </li>
       
      ))}
    </ul>
  );
};

export default Acceptedfriendlist;