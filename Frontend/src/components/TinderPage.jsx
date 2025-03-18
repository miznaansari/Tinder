import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TinderPage = ({ userId, user, socket, onLogout, notification }) => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [friendRequests, setFriendRequests] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const cardRef = useRef(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://tinder-g832.onrender.com/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser._id) return;

        const response = await axios.get(`https://tinder-g832.onrender.com/api/friend-requests/${storedUser._id}`);
        setFriendRequests(response.data.data);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchUsers();
    fetchFriendRequests();
  }, []);

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleSwipe = async (direction) => {
    if (!users[currentIndex]) return; // Prevent errors if user is missing

    if (direction === 'right') {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser._id) throw new Error('User not found');

        const senderId = storedUser._id;
        const receiverId = users[currentIndex]._id;

        await axios.post('https://tinder-g832.onrender.com/api/friend-requests/send', { senderId, receiverId });
        showToast(`Friend request sent to ${users[currentIndex].name}`);
      } catch (error) {
        showToast(error.message || 'Error sending friend request', 'error');
      }
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex < users.length) {
      setCurrentIndex(nextIndex);
    } else {
      alert('No more users');
    }
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.post(`http://localhost:4000/api/friend-requests/${requestId}/${action}`);
      showToast(`Request ${action}ed successfully`);
    } catch (error) {
      showToast(error.message || 'Error processing request', 'error');
    }
  };

  if (!users.length || !users[currentIndex]) {
    return <p className="text-xl font-bold text-gray-600">Loading users or no users available</p>;
  }

  const currentUser = users[currentIndex];
  const existingRequest = currentUser 
    ? friendRequests.find((req) => req.receiver?._id === currentUser?._id)
    : null;

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 relative">
      <button onClick={onLogout} className='font-bold'>Logout</button>

      {toastMessage && (
        <div className={`absolute top-4 right-4 p-4 rounded-lg text-white shadow-lg ${toastType === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {toastMessage}
        </div>
      )}

      {notification && <p className="absolute top-4 left-4 p-4 bg-blue-500 text-white rounded-lg shadow-lg">{notification}</p>}

      <div
        ref={cardRef}
        className="relative w-80 h-96 bg-white shadow-2xl rounded-xl overflow-hidden transform transition-transform"
      >
        <img
          src={currentUser?.profilePicture 
            ? `https://tinder-g832.onrender.com${currentUser.profilePicture}` 
            : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
          alt={currentUser?.name || "Default Avatar"}
          className="w-full h-2/3 object-cover"
        />

        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">{currentUser?.name}</h2>
          <p className="text-gray-600">{currentUser?.bio}</p>
        </div>
      </div>

      <div className="absolute bottom-10 flex gap-6">
        {existingRequest ? (
          <>
            <button onClick={() => handleRequestAction(existingRequest._id, 'accept')} className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600">Accept</button>
            <button onClick={() => handleRequestAction(existingRequest._id, 'reject')} className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600">Reject</button>
            <button onClick={() => handleSwipe('left')} className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600">❌</button>
          </>
        ) : (
          <>
            <button onClick={() => handleSwipe('left')} className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600">❌</button>
            <button onClick={() => handleSwipe('right')} className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600">❤️</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TinderPage;
