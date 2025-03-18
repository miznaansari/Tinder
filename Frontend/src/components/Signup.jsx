import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    dob: '',
    profilePicture: null,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profilePicture') {
      setFormData({ ...formData, profilePicture: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formDataToSend = new FormData();
    for (const key in formData) {
      formDataToSend.append(key, formData[key]);
    }

    try {
      const response = await axios.post('https://tinder-g832.onrender.com/api/create', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(response.data.success);
    } catch (error) {
      setError(error.response?.data?.error || 'Something went wrong!');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-6 py-12">
      <div className="sm:max-w-md w-full">
        <img className="mx-auto h-12 w-auto" src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">Create Your Account</h2>
        
        {error && <p className="mt-4 text-red-500">{error}</p>}
        {success && <p className="mt-4 text-green-500">{success}</p>}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-900">Full Name</label>
            <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange}
              className="mt-2 w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600" />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">Email Address</label>
            <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange}
              className="mt-2 w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600" />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900">Password</label>
            <input type="password" name="password" id="password" required value={formData.password} onChange={handleChange}
              className="mt-2 w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600" />
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dob" className="block text-sm font-medium text-gray-900">Date of Birth</label>
            <input type="date" name="dob" id="dob" required value={formData.dob} onChange={handleChange}
              className="mt-2 w-full rounded-md border-gray-300 px-3 py-2 focus:outline-indigo-600" />
          </div>

          {/* Profile Picture */}
          <div>
            <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-900">Profile Picture</label>
            <input type="file" name="profilePicture" id="profilePicture" accept="image/*" onChange={handleChange}
              className="mt-2 w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
          </div>

          {/* Submit Button */}
          <div>
            <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-500">Sign Up</button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-gray-500">
          Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-500">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
