// WeatherPage.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherPage = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        // Call your backend API to retrieve weather data
        const response = await axios.get('/weather');
        setWeatherData(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching weather data');
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Weather Forecast for the Next 7 Days</h2>
      <div>
        {weatherData.map((day, index) => (
          <div key={index}>
            <p>Date: {day.date}</p>
            <p>Temperature: {day.temperature}</p>
            {/* Display other weather details as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeatherPage;