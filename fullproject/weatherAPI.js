import fetch from 'node-fetch';

const callWeatherAPI = async (city) => {
  const apiKey = '8f637d4e9423cfbc473e25f570e124e9';

  try {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error calling weather API:', error);
    throw error;
  }
};

export default callWeatherAPI;



