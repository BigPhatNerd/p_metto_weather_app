const { getWeather } = require('../services/weatherService')

const fetchWeather = async (req, res) => {
  const { location } = req.query
  try {
    const weatherData = await getWeather(location)
    res.json(weatherData)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { fetchWeather }
