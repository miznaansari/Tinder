import React, { useEffect, useState } from 'react';
import axios from 'axios';

function FriendRequest({ userId, user, socket, onLogout, notification }) {
  const [users, setUsers] = useState([]);
  const [friendRequests, setFriendRequests] = useState({ sentRequests: [], receivedRequests: [] });

  useEffect(() => {
    fetchFriendRequestStatus();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('https://tinder-g832.onrender.com/api/users');
      console.log('API Response:', response.data);
      
      const filteredUsers = response.data.filter((u) => u._id !== userId);
      console.log('Filtered Users:', filteredUsers);
      
      setUsers(filteredUsers);
    } catch (error) {
      alert('Error fetching users: ' + error.message);
    }
  };
  

  const handleSendRequest = async (receiverId) => {
    try {
      await axios.post('https://tinder-g832.onrender.com/api/friend-requests/send', {
        senderId: userId,
        receiverId,
      });

      socket.current.emit('sendNotification', {
        receiverId,
        message: `You have a new friend request from ${user?.name}`,
      });

      alert('Friend request sent successfully!');
      fetchFriendRequestStatus();
    } catch (error) {
      alert('Error sending request: ' + error.response?.data?.error || error.message);
    }
  };

  const fetchFriendRequestStatus = async () => {
    try {
      const response = await axios.get(`https://tinder-g832.onrender.com/api/friend-requests/status/${userId}`);
      setFriendRequests(response.data);
    } catch (error) {
      console.error('Error fetching request status:', error);
    }
  };

  const handleAcceptRequest = async (senderId) => {
    try {
      await axios.post('https://tinder-g832.onrender.com/api/friend-requests/accept', {
        senderId,
        receiverId: userId,
      });
      alert('Friend request accepted!');
      fetchFriendRequestStatus();
    } catch (error) {
      alert('Error accepting request: ' + error.response?.data?.error || error.message);
    }
  };

  return (
    <>
    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
      <p className="text-lg font-semibold mb-4">Welcome, {user?.name}!</p>
      <div className="flex space-x-4 mb-8">
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={fetchUsers}>Fetch Users</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={onLogout}>Logout</button>
      </div>

      {notification && <p className="text-green-600 mt-4">{notification}</p>}

      {/* Friend Requests Section */}
      <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
      <h3>Sent Requests:</h3>
      {friendRequests.sentRequests.length === 0 ? (
        <p>No sent requests</p>
      ) : (
        friendRequests.sentRequests.map((req, index) => <p key={index}>To {req.userName}: {req.status}</p>)
      )}

      <h3 className="mt-4">Received Requests:</h3>
      {friendRequests.receivedRequests.length === 0 ? (
        <p>No received requests</p>
      ) : (
        friendRequests.receivedRequests.map((req, index) => (
          <div key={index}>
            <p>From {req.userName}: {req.status}</p>
            {req.status === 'Pending' && (
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                onClick={() => handleAcceptRequest(req.userId)}
              >
                Accept
              </button>
            )}
          </div>
        ))
      )}
      <h2 className="text-xl font-semibold mb-4">Users</h2>
{users.length === 0 ? (
  <p>No users available</p>
) : (
  users.map((u) => (
    <div key={u._id} className="flex items-center space-x-4">
      <p>{u.name}</p>
      <button 
        className="bg-green-500 text-white px-4 py-2 rounded"
        onClick={() => handleSendRequest(u._id)}
      >
        Send Friend Request
      </button>
    </div>
  ))
)}

    </div>
    
    </>
  );
}

export default FriendRequest;
