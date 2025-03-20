import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaBan } from 'react-icons/fa';

const PendingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await axios.get(`https://tinder-g832.onrender.com/api/friend-requests/${user._id}`);
        const filteredRequests = response.data.data.filter(request => request.sender?._id !== user._id && request.status !== 1);
        setRequests(filteredRequests);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      const idd = id._id;
      const response = await axios.post(`https://tinder-g832.onrender.com/api/friend-requests/${action}`, {
        id: id._id,
        receiverId: id.receiver._id,
        senderId: id.sender._id
      });
      setRequests(requests.filter(request => request._id !== idd));
      setToastMessage(`Request ${action}ed successfully`);
      setTimeout(() => setToastMessage(''), 3000);
    } catch (error) {
      setToastMessage(error.message || 'Error processing request');
    }
  };

  return (
    <>
      {toastMessage && (
        <div className="absolute top-4 right-4 z-100 p-4 rounded-lg text-white shadow-lg bg-green-500">
          {toastMessage}
        </div>
      )}

      <ul className="list bg-base-200 text-base-content text-black rounded-box shadow-md">
        <li className="p-4 text-xs text-base-content opacity-60 tracking-wide">Pending Friend Requests</li>
        {loading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex w-full flex-col gap-4 p-2">
              <div className="skeleton h-20 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          ))
        ) : (
          requests.map((request, index) => (
            <li key={request._id} className="list-row flex items-center justify-between p-4 border-b">
              <div className='flex items-center gap-4'>
                <div className="text-2xl font-thin text-base-content opacity-30 tabular-nums">{index + 1}</div>
                <img className="size-10 rounded-box" src={request.sender?.profileImage ? `https://tinder-g832.onrender.com${request.sender.profileImage}` : 'https://img.daisyui.com/images/profile/demo/1@94.webp'} alt={request.sender?.name || 'User'} />
                <div className="list-col-grow">
                  <div className='text-base-content'>{request.sender?.name || 'Unknown'}</div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleAction(request, 'accept')} className="btn btn-success btn-sm flex items-center">
                  <FaCheck className="size-4" /><span className="hidden md:inline"> Accept</span>
                </button>
                <button onClick={() => handleAction(request, 'ignore')} className="btn btn-warning btn-sm flex items-center">
                  <FaBan className="size-4" /><span className="hidden md:inline"> Ignore</span>
                </button>
                <button onClick={() => handleAction(request, 'reject')} className="btn btn-error btn-sm flex items-center">
                  <FaTimes className="size-4" /><span className="hidden md:inline"> Reject</span>
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </>
  );
};

export default PendingRequest;