import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FindLocation = ({ onLocationFetch }) => {
    const [location, setLocation] = useState({ city: '', state: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLocation = () => {
            const user = JSON.parse(localStorage.getItem('user'));
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        const { latitude, longitude } = position.coords;

                        try {
                            const response = await axios.get(
                                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
                            );

                            console.log(response.data.address)
                            const address = {
                                ...response.data.address,
                                userId: user._id
                              };
                              console.log(address);
                              

                            const responselocation = await axios.post(`${import.meta.env.VITE_URL}/api/currentLocation`, address )
                            console.log(responselocation)



                            const city = response.data.address.city || response.data.address.town || response.data.address.village;
                            const state = response.data.address.state;

                            setLocation({ city, state });
                            //   onLocationFetch({ city, state }); // Pass location to parent component
                        } catch (err) {
                            setError('Failed to fetch location. Please try again.');
                        }
                    },
                    (error) => {
                        setError(error.message);
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser.');
            }
        };

        fetchLocation();
    }, [onLocationFetch]);

    return (
        <div>
            {error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <p className="text-green-500">City: {location.city}, State: {location.state}</p>
            )}
        </div>
    );
};

export default FindLocation;
