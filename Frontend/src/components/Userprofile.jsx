import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { motion, useAnimation } from 'framer-motion';
const Userprofile = () => {
    const navigate = useNavigate();
    const [profilePicture, setProfilePicture] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loader, setloader] = useState(false);
    const [success, setsuccess] = useState(false)
    const [totalFriend, settotalFriend] = useState('0')

    const [user, setuser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    // Get user from localStorage

    useEffect(() => {
        
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);
    useEffect( ()=>{
        const fetchFriend = async ()=>{
            const response = await axios.post(`${import.meta.env.VITE_URL}/api/friend-requests/accepted`, { id: user._id });
            console.log(response.data.data.length)
            settotalFriend(response.data.data.length);
        } 
        fetchFriend()
      
    },[])
    // Handle file selection and create preview
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setProfilePicture(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result); // Set image preview
            };
            reader.readAsDataURL(file);
        }
    };
    


    // Handle image upload
    const handleUpload = async () => {
        setloader(true);
        const user = JSON.parse(localStorage.getItem('user')); // Get user from localStorage
        if (!user || !user._id) {
        setloader(false);

            return alert('User not found. Please log in.');
        }

        if (!profilePicture) {
        setloader(false);

            return alert('Please select a picture to upload.');
        }

        const formData = new FormData();
        formData.append('profilePicture', profilePicture);
        formData.append('userId', user._id);

        try {
            const response = await axios.put(`${import.meta.env.VITE_URL}/api/updateProfilePicture`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const updatedUser = response.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            setuser(updatedUser);
            setloader(false);

            setsuccess(true)
            setTimeout(() => setsuccess(false), 5000)
            //   alert(response.data.success || 'Profile picture updated successfully');
            setPreview(null); // Clear preview after successful upload
             // ✅ Close Modal
    document.getElementById('my_modal_1').close();
        } catch (error) {
            console.error('Error:', error);
            alert(error.response?.data?.error || 'Failed to upload picture');
        }
    };


    
    return (
        <>

            {success && <div role="alert" className="alert alert-success mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Profile picture updated successfully!</span>
            </div>}
            <div className='lg:flex lg:justify-around lg:mt-10 mt-5'>
                <div className='flex'>
                    <div className="avatar flex-col">
                        <div className="w-24 rounded">
                            <img src={user?.profilePicture ? import.meta.env.VITE_URL + user.profilePicture : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"} />
                        </div>
                        {/* Open Modal */}
                        <button className="btn w-24 text-[10px]" onClick={() => document.getElementById('my_modal_1').showModal()}>
                            Upload Pic
                        </button>

                        {/* Modal Section */}
                        <dialog id="my_modal_1" className="modal">
                            <div className="modal-box">
                                <h3 className="font-bold text-lg">Upload Your Picture</h3>

                                {/* File Input */}
                                <input type="file" accept="image/*" onChange={handleFileChange} className="file-input file-input-bordered w-full my-4" />

                                {/* Image Preview */}
                                {preview && (
                                    <div className="my-4">
                                        <p className="text-sm">Image Preview:</p>
                                        <img src={preview} alt="Profile Preview" className="w-12 h-2 object-cover rounded-full border-2 border-gray-300" />
                                    </div>
                                )}

                                {/* Upload Button */}
                                <div className='flex items-center justify-between'>
                                    <button onClick={handleUpload} className="btn btn-primary mt-4">{loader ? (<><span className="loading loading-bars loading-xs"></span> Uploading</>) : "Upload"} </button>
                                    <form method="dialog">
                                        <button className="btn  mt-4">Close</button>
                                    </form>
                                </div>


                            </div>
                        </dialog>

                    </div>
                    <div className="overflow-x-auto">
                        <table className="table">
                            {/* head */}
                            <thead>

                            </thead>
                            <tbody>
                                {/* row 1 */}
                                <tr>
                                    <td>Name:</td>
                                    <td>{user?.name}</td>
                                </tr>
                                {/* row 2 */}
                                <tr>
                                    <td>Age</td>
                                    <td>{user?.dob ? Math.floor((new Date() - new Date(user.dob)) / 31536000000) : 'Age not available'}</td>
                                </tr>
                                {/* row 3 */}
                                <tr>
                                    <td>Location</td>
                                    <td>Delhi</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="stats shadow flex flex-wrap md:flex-nowrap">
                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                            </svg>
                        </div>
                        <div className="stat-title">Total Friends</div>
                        <div className="stat-value text-primary">{totalFriend}</div>
                        <div className="stat-desc">21% more than last month</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                            </svg>
                        </div>
                        <div className="stat-title">Profile Visited</div>
                        <div className="stat-value text-secondary">2.6M</div>
                        <div className="stat-desc">21% more than last month</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-secondary">
                            <div className="avatar online">
                                <div className="w-16 rounded-full">
                                    <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>
                        </div>
                        <div className="stat-value">86%</div>
                        <div className="stat-title">Tasks done</div>
                        <div className="stat-desc text-secondary">31 tasks remaining</div>
                    </div>
                </div></div>
        </>
    )
}

export default Userprofile
