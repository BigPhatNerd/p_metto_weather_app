const axios = require('axios')

const getWeather = async (location) => {
  const { latitude, longitude, city, state } = location
  let response
  if (latitude && longitude) {
    response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    )
  } else if (city && state) {
    response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${state}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    )
  } else if (city) {
    response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    )
  } else {
    throw new Error('Invalid location data')
  }
  return response.data
}

//api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}
https: module.exports = { getWeather }
