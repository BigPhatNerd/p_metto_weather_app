const axios = require('axios')

const getWeather = async (location) => {
  const { latitude, longitude, city, state } = location
  if (!((latitude && longitude) || (city && state))) {
    throw new Error('Invalid location data')
  }
  let response
  try {
    if (latitude && longitude) {
      console.log('hitting latitude and longitude')
      response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${process.env.OPENWEATHERMAP_API_KEY}`
      )
    } else if (city && state) {
      console.log('hitting city and state')
      response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},${state},&appid=${process.env.OPENWEATHERMAP_API_KEY}`
      )
    }

    if (response.data.cod !== 200) {
      throw new Error(response.data.message)
    }
    console.log({ ErrorResponseData: response.data })
    return response.data
  } catch (error) {
    console.error('Error fetching weather data:', error.message)
    throw new Error(
      error.response ? error.response.data.message : error.message
    )
  }
}
// https://api.openweathermap.org/data/2.5/weather?q=Memphis,TN,&appid=2293a78ee4e8dab1902c613c97856ae7

//api.openweathermap.org/data/2.5/weather?q={city name},{state code},{country code}&appid={API key}
https: module.exports = { getWeather }
