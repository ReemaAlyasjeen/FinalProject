import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LoginRegisterPage from './LoginRegisterPage';
import ProfilePage from './ProfilePage';
import './LoginRegisterPage.css';
import './ProfilePage.css';
import './WeatherPage.css';
function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  useEffect(() => {
    // Fetch user data or handle authentication
    axios.get('http://localhost:3001/user')
      .then(response => {

        setUser(response.data);
      })
      .catch(error => {
        console.error(error);
      });

    // Fetch search history
    axios.get('http://localhost:3001/search-history')
      .then(response => {
        setSearchHistory(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleSearch = () => {
    // Fetch weather data
    axios.get('http://localhost:3001/weather', {
      params: {
        location,
        userEmail: user.email,
      },
    })
    .then(response => {
      setWeatherData(response.data);
      // Update search history
      axios.post('http://localhost:3001/search-history', {
        location,
        userEmail: user.email,
      });
    })
    .catch(error => {
      console.error(error);
    });
  };

  return (
    <div className="App">
      {/* Your UI components, login/register, profile, and weather display */}
      <Router>
      <div>
        <Switch>
          <Route path="/" exact component={LoginRegisterPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/weather" component={WeatherPage} />
        </Switch>
      </div>
    </Router>
      <input
        type="text"
        placeholder="Enter location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      {/* Display weather data */}
      {weatherData && (
        <div>
          <h2>{weatherData.name}, {weatherData.sys.country}</h2>
          {/* Display other weather details as needed */}
        </div>
      )}

      {/* Display search history */}
      <div>
        <h3>Search History</h3>
        {searchHistory.map((item, index) => (
          <p key={index}>{item.location}</p>
        ))}
      </div>
    </div>
  );
}

export default App;
