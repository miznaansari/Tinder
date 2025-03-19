import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate,useLocation } from 'react-router';

const Acceptedfriendlist = () => {
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchFriends = async () => {
        
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.post('https://tinder-1-an6v.onrender.com/api/friend-requests/accepted', { id: user._id });

        if (response.data.success) {
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

  const handlechat = (friend) => {
    console.log(friend)
    const user = JSON.parse(localStorage.getItem('user'));


    navigate('/chat', { state: { sender: friend.sender, receiver: friend.receiver } });
  };

  return (
    <ul role="list" className="divide-y divide-gray-100">
      {friends.map((friend) => (
        <li
          key={friend._id}
          className="flex justify-between gap-x-6 py-5 cursor-pointer"
          onClick={() => handlechat(friend)}
        >
          <div className="flex min-w-0 gap-x-4">
            <img
              className="size-12 flex-none rounded-full bg-gray-50"
              src={`https://tinder-g832.onrender.com${friend?.receiver?.profilePicture}` || 'https://via.placeholder.com/256'}
              alt={friend.receiver.name}
            />
            <div className="min-w-0 flex-auto">
              <p className="text-sm/6 font-semibold text-gray-900">{friend.receiver.name}</p>
              <p className="mt-1 truncate text-xs/5 text-gray-500">{friend.receiver.email}</p>
            </div>
          </div>
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p className="text-sm/6 text-gray-900">Friend</p>
            <p className="mt-1 text-xs/5 text-gray-500">Accepted on {new Date(friend.createdAt).toLocaleString()}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default Acceptedfriendlist;
