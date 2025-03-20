import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaBan } from 'react-icons/fa';

const PendingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [toastMessage, setToastMessage] = useState('');


  useEffect(() => {
    const fetchRequests = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await axios.get(`https://tinder-g832.onrender.com/api/friend-requests/${user._id}`);
        console.log(response);
        const filteredRequests = response.data.data.filter(request => request.sender?._id !== user._id && request.status !== 1);
       console.log(filteredRequests)
        setRequests(filteredRequests);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {

    // try {
        console.log(id._id)
        const idd = id._id;
        // console.log(existingRequest.receiver._id ); // Sometimes it could be 'id' instead of '_id'
  
       const response= await axios.post(`https://tinder-g832.onrender.com/api/friend-requests/${action}`,{
          id: id._id,
          receiverId:id.receiver._id,
          senderId:id.sender._id
        });
        console.log(response)
        setRequests(requests.filter(request => request._id !== idd));
        setToastMessage(`Request ${action}ed successfully`);
        setInterval(() => {
            setToastMessage('')
        }, 3000);
    //   } catch (error) {
    //     setToastMessage(error.message || 'Error processing request', 'error');
    //   }

    // try {
    //     console.log('asdfsd')
    //   await axios.post(`https://tinder-g832.onrender.com/api/friend-requests/${id}/${action}`);
    //   setRequests(requests.filter(request => request._id !== id));
    // } catch (error) {
    //   console.error(`Error performing ${action} action:`, error);
    // }
  };

  return (
    <>
    {toastMessage && (
        <div className={`absolute top-4 right-4  z-100 p-4 rounded-lg text-white shadow-lg bg-green-500`}>
          {toastMessage}
        </div>
      )}
    <ul className="list bg-white text-black rounded-box shadow-md mt-3" style={{"borderRadius":"0px"}}>
      <li className="p-4 pb-2 text-xs opacity-60 tracking-wide" >Pending Friend Requests</li>
      <hr />
      {requests.map((request, index) => (
        <li key={request._id} className="list-row flex items-center justify-between p-4 border-b" style={{"borderRadius":"0px"}}>
            <div className='flex items-center gap-4'>
          <div className="text-4xl font-thin opacity-30 tabular-nums">{index + 1}</div>
          <img className="size-10 rounded-box" src={request.sender?.profileImage ? `https://tinder-g832.onrender.com${request.sender.profileImage}` : 'https://img.daisyui.com/images/profile/demo/1@94.webp'} alt={request.sender?.name || 'User'} />
          <div className="list-col-grow">
            <div>{request.sender?.name || 'Unknown'}</div>
          </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => handleAction(request, 'accept')} className="btn btn-success btn-sm flex items-center">
              <FaCheck className="size-4" /><span className="hidden md:inline"> Accept</span>
            </button>
            <button onClick={() => handleAction(request._id, 'ignore')} className="btn btn-warning btn-sm flex items-center">
              <FaBan className="size-4" /><span className="hidden md:inline"> Ignore</span>
            </button>
            <button onClick={() => handleAction(request, 'reject')} className="btn btn-error btn-sm flex items-center">
              <FaTimes className="size-4" /><span className="hidden md:inline"> Reject</span>
            </button>
          </div>
        </li>
      ))}
    </ul>
    </>
  );
};

export default PendingRequest;