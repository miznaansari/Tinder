import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserSearch = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://tinder-g832.onrender.com/api/users');
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    const filtered = users.filter(user => user.name.toLowerCase().includes(query));
    setFilteredUsers(filtered);
  };

  const handleSendRequest = (userId) => {
    console.log(`Send request to user with ID: ${userId}`);
  };

  return (
    <div className="p-4">
      <label className="input mb-4 w-full sticky top-20 z-100 left-0">
        <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><g strokeLinejoin="round" strokeLinecap="round" strokeWidth="2.5" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></g></svg>
        <input type="search" className="grow" placeholder="Search" onChange={handleSearch} />
        <kbd className="kbd kbd-sm">⌘</kbd>
        <kbd className="kbd kbd-sm">K</kbd>
      </label>

      {loading ? (
        <div className="flex w-full flex-col gap-4 p-2">
          <div className="skeleton h-20 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      ) : (
        <ul className="list bg-base-100 rounded-box shadow-md">
          {filteredUsers.map((user, index) => (
            <li key={index} className="list-row p-4 flex justify-between items-center gap-4">
                <div className='flex gap-3'>
              <img className="size-10 rounded-box" src={user.profilePicture || 'https://img.daisyui.com/images/profile/demo/1@94.webp'} alt={user.name} />
              <div>
                <div>{user.name}</div>
                <div className="text-xs uppercase font-semibold opacity-60">{user.status || 'Active'}</div>
              </div>
              </div>
              <button className="btn btn-primary" onClick={() => handleSendRequest(user.id)}>Send Request</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserSearch;
