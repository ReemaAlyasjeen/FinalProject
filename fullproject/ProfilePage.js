// ProfilePage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Assuming you have a way to get the user's ID or email from authentication
        const response = await axios.get('/profile/:userId'); // Replace ':userId' with actual user ID or email
        setUser(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Profile Page</h2>
      {user && (
        <div>
          <p>Email: {user.email}</p>
          {/* Display other user details as needed */}
        </div>
      )}
    </div>
  );
};

export default ProfilePage;