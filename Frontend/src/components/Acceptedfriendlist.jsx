import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router';
import { useOnlineStatus } from './OnlineStatusContext';
import { ClockFading } from 'lucide-react';
import Chatbot from './Chatbot';
import { motion } from 'framer-motion';
import ChatDesktop from './chatDesktop';

const Acceptedfriendlist = () => {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const onlineUsers = useOnlineStatus();
  const [pendingRequest, setpendingRequest] = useState('')
  const [noFriend, setnoFriend] = useState(false)

  useEffect(() => {
    const friendRequests = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const response = await axios.get(`${import.meta.env.VITE_URL}/api/friend-requests/${user._id}`);
      const filteredRequests = response.data.data.filter(request => request.sender?._id !== user._id && request.status !== 1);
      console.log(filteredRequests.length)
      setpendingRequest(filteredRequests.length)
    }
    friendRequests();

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
          console.log(response.data.data.length + "adfds")
          if (response.data.data.length === 0) {
            setnoFriend(true);
          }

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
  const [open, setOpen] = useState(false)
  const [sender, setSender] = useState(null)
  const [receiver, setReceiver] = useState(null)

const handleChat = (friend) => {
  if (window.innerWidth <= 768) {
    navigate('/chat', { state: { sender: friend.sender, receiver: friend.receiver } });
  } else {
    setOpen(true);
    setSender(friend.sender);
    setReceiver(friend.receiver);
  }
};


  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight);
    };



    console.log(height)
  }, []);

  return (
    <>
      <div className='d-flex'>
        <div className='flex justify-between items-center p-2 sticky top-20 bg-base-100'>
          <span className="text-xs opacity-60 tracking-wide">Accepted Friends List</span>
          <Link to="/pendingrequest" className="tab tab-active"><div className="text-xs opacity-60 tracking-wide tabs tabs-lift">
            <p className="indicator tab tab-active">
              Pending Request
              <span className="indicator-item badge">{pendingRequest}</span>
            </p>
          </div> </Link>
        </div>
        <div className={`flex w-full h-[80dvh] overflow-hidden`}>
        <ul className="list bg-base-200 text-base-content w-full sm:w-full md:w-1/3 lg:w-1/3 rounded-box shadow-md sticky top-0 h-[80dvh] overflow-auto">


            {noFriend && (
              <motion.div role="alert" className="alert alert-info" initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="h-6 w-6 shrink-0 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>You haven't added any friends yet. Start connecting with people!</span>
              </motion.div>
            )}

            <li className="list-row" onClick={() => navigate('/train')}>
              <div><img className="size-10 rounded-box " src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAMAAABF0y+mAAAAdVBMVEX////5+Pzi4vKztuC0u+JpdclffM2prdxhdspVfM2cteLFxeZgbsdif85Yg9E6ftC2zeywq9tma8VThtJKitUphdWPvOfo4fHCtN5+bMNxb8ZsestFjNY8kdkmkdoil96bzO/X6/n2+v1RdMsRjdqw0u+dxOoXwiEkAAAAa0lEQVR4AdXLgxHAUAAD0NS27e6/YXEuMsB/5wACkyRwsgxOUcFpOijDtGwQjuv5QYhfUez5SZrln0IqyqpurrLt+mGc5ndZa/ex64ZPeTMWP227NcevMLi6DYTd3j+m7cHtO7hpAjfPENcJ+wwG2aDUGTgAAAAASUVORK5CYII=" /></div>
              <div>
                <div>Gemini AI</div>
                <div className="text-xs uppercase font-semibold opacity-60">Chat with Gemini AI</div>
              </div>

            </li>

            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex w-full flex-col gap-4 p-2">
                  <div className="skeleton h-20 w-full"></div>
                  <div className="skeleton h-4 w-full"></div>
                </div>
              ))
            ) : (


              friends.map((friend) => (
                <>
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
                </>
              ))
            )}

          </ul>
          <div className='hidden md:flex md:w-2/3'>
            {open && <ChatDesktop sender={sender} receiver={receiver} />}
          </div>
        </div>
      </div>
    </>
  );
};

export default Acceptedfriendlist;
