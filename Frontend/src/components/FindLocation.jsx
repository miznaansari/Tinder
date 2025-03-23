import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FindLocation = ({ onLocationFetch }) => {
  const [location, setLocation] = useState({ city: '', state: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await axios.get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              );

              const address = response.data.address;
              const city = address.city || address.town || address.village;
              const state = address.state;

              setLocation({ city, state });
              onLocationFetch({ city, state }); // Pass location to parent component
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
