const express = require('express');
const WeatherData = require('./weatherDataModel');
const app = express();
const PORT = process.env.PORT || 3000


const redis = require('redis');
const { promisify } = require('util');
const callWeatherAPI = require('./weatherAPI').default;

const mongoose = require('mongoose');
const weatherSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    required: true,
  },
});

const WeatherData = mongoose.model('WeatherData', weatherSchema);

module.exports = WeatherData;
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: String,
  lastName: String,
  weatherBehavior: {
    searches: {
      type: Number,
      default: 0,
    },
    
  },
  preferences: {
    type: Object,
    default: {}, 
  },
  searchHistory: [{
    location: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;


// User registration route
app.post('/register', async (req, res) => {
  const { email, firstName, lastName } = req.body;

  try {
    const newUser = new User({
      email,
      firstName,
      lastName,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Weather search route
app.post('/weather/search', async (req, res) => {
  const { location, email } = req.body;

  try {
    // Fetch weather data from the API
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=8f637d4e9423cfbc473e25f570e124e9&q=${location}`);

    // Save weather data to MongoDB collection
    const newWeatherData = new WeatherData({
      userEmail: email,
      location: location,
      data: response.data,
    });
    await newWeatherData.save();

    // Update user's search history
    await User.findOneAndUpdate(
      { email },
      { $push: { searchHistory: { location, timestamp: Date.now() } } },
      { new: true }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// User preferences route
app.post('/preferences', async (req, res) => {
  const { email, preferences } = req.body;

  try {
    // Find user by email and update preferences
    const user = await User.findOneAndUpdate(
      { email },
      { preferences },
      { new: true }
    );
    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user preferences:', error);
    res.status(500).json({ error: 'Failed to update user preferences' });
  }
});

// MongoDB Connection
mongoose.connect('mongodb+srv://remaalyasjeen:juExPHriDTbtcXgR@cluster0.kr9dril.mongodb.net/?retryWrites=true&w=majority');
const db = mongoose.connection;

db.once('open', () => {
  console.log('Connected to MongoDB');
});

app.post('/user', async (req, res) => {
  const { email, firstName, lastName } = req.body;

  try {
    const newUser = new User({
      email,
      firstName,
      lastName,
    });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});





// Create Redis client
const redisClient = redis.createClient();
const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

app.get('/weather', async (req, res) => {
  const city = 'jordan'; // You can change the city as needed
  const redisKey = `weather:${city}`;

  try {
    // Check if weather data is cached in Redis
    const cachedWeatherData = await getAsync(redisKey);

    if (cachedWeatherData) {
      console.log('Weather data fetched from cache');
      return res.json(JSON.parse(cachedWeatherData));
    }

    // If weather data is not cached, fetch it from the API
    const weatherData = await callWeatherAPI(city);

    // Cache weather data in Redis for 1 hour (3600 seconds)
    await setAsync(redisKey, JSON.stringify(weatherData), 'EX', 3600);

    res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});
// Weather search route
app.post('/weather/search', async (req, res) => {
  const { location, email } = req.body;

  try {
    // Fetch weather data from the API
    const response = await axios.get(`https://api.weatherapi.com/v1/current.json?key=8f637d4e9423cfbc473e25f570e124e9&q=${location}`);

    // Save weather data to MongoDB collection
    const newWeatherData = new WeatherData({
      userEmail: email,
      location: location,
      data: response.data,
    });
    await newWeatherData.save();

    res.status(200).json(response.data);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
