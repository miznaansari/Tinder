import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const TinderPage = ({ userId, user, socket, onLogout, notification }) => {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [friendRequests, setFriendRequests] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');
  const [swipePosition, setSwipePosition] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeComplete, setSwipeComplete] = useState(false);
  const [userdetail, setuser] = useState(localStorage.getItem('user'));

  const cardRef = useRef(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  useEffect(() => {
    if (socket) {
      socket.on('friendRequestNotification', (data) => {
        console.log(data.message);
      });
  
      return () => socket.off('friendRequestNotification');
    }
  }, [socket]);
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const response = await axios.get('http://localhost:4000/api/users');
        const filteredUsers = response.data.filter((u) => u._id !== user._id);
    setUsers(filteredUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchFriendRequests = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser._id) return;

        const response = await axios.get(`http://localhost:4000/api/friend-requests/${storedUser._id}`);
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
    if (!users[currentIndex]) return;

    if (direction === 'right') {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser._id) throw new Error('User not found');

        const senderId = storedUser._id;
        const receiverId = users[currentIndex]._id;

        await axios.post('http://localhost:4000/api/friend-requests/send', { senderId, receiverId });
        showToast(`Friend request sent to ${users[currentIndex].name}`);
      } catch (error) {
        showToast(error.message || 'Error sending friend request', 'error');
      }
    }

    // Animate swipe out
    setSwipePosition(direction === 'right' ? 500 : -500);
    setSwipeComplete(true);

    setTimeout(() => {
      setSwipePosition(0);
      setSwipeComplete(false);

      const nextIndex = currentIndex + 1;
      if (nextIndex < users.length) {
        setCurrentIndex(nextIndex);
      } else {
        alert('No more users');
      }
    }, 300); // 300ms for smooth transition
  };

  const handleRequestAction = async (requestId, action) => {
    try {
      console.log(existingRequest.receiver._id ); // Sometimes it could be 'id' instead of '_id'

      await axios.post(`http://localhost:4000/api/friend-requests/${action}`,{
        id: existingRequest._id,
        receiverId:existingRequest.receiver._id,
        senderId:existingRequest.sender._id
      });
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
    ? friendRequests.find((req) => req.sender?._id === currentUser?._id)
    : null;

  // Handle Swipe on Mobile with Animation
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const onTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
    const diff = touchEndX.current - touchStartX.current;
    setSwipePosition(diff);
  };

  const onTouchEnd = () => {
    const diff = touchEndX.current - touchStartX.current;
    if (Math.abs(diff) > 150) {
      if (diff > 0) {
        handleSwipe('right');
      } else {
        handleSwipe('left');
      }
    } else {
      setSwipePosition(0);
      setIsSwiping(false);
    }
  };
const userdetailname = JSON.parse( userdetail)
  return (
    <div className="flex flex-col items-center justify-center pt-20 bg-base-200 relative">
      <h1 className='text-3xl text-base-content'>{userdetailname.name}</h1>

      {toastMessage && (
        <div className={`absolute top-4 right-4 p-4 rounded-lg text-white shadow-lg ${toastType === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
          {toastMessage}
        </div>
      )}

      {notification && <p className="absolute top-5 left-4 p-4 bg-blue-500 text-white rounded-lg shadow-lg">{notification}</p>}

      <div
        ref={cardRef}
        className={`relative w-80 h-96 bg-white shadow-2xl rounded-xl overflow-hidden transition-transform duration-300 ${swipeComplete ? 'opacity-0' : 'opacity-100'} ${isSwiping ? '' : 'transition-all ease-in-out'}`}
        style={{
          transform: `translateX(${swipePosition}px) rotate(${swipePosition / 20}deg)`,
        }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img
          src={currentUser?.profilePicture
            ? `http://localhost:4000${currentUser.profilePicture}`
            : "https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg"}
          alt={currentUser?.name || "Default Avatar"}
          className="w-full h-2/3 object-cover"
        />

        <div className="p-4">
          <h2 className="text-2xl font-semibold text-gray-800">{currentUser?.name}</h2>
          <p className="text-gray-600">{currentUser?.bio}</p>
        </div>
      </div>

      <div className="absolute bottom-5 flex gap-6">
        {existingRequest ? (
          <>
            <button onClick={() => handleRequestAction(existingRequest, 'accept')} className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600">Accept</button>
            <button onClick={() => handleRequestAction(existingRequest._id, 'reject')} className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600">Reject</button>
            <button onClick={() => handleSwipe('left')} className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600">X</button>

          </>
        ) : (
          <>
            <button onClick={() => handleSwipe('right')} className="bg-green-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-green-600">❤️</button>

            <button onClick={() => handleSwipe('left')} className="bg-red-500 text-white px-6 py-3 rounded-full shadow-md hover:bg-red-600">❌</button>
          </>
        )}
      </div>
    </div>
  );
};

export default TinderPage;
