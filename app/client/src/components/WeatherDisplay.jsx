/* eslint-disable react/prop-types */
import { useContext, useState, useEffect } from 'react'
import { UserContext } from '../contexts/UserContext'

function WeatherDisplay() {
  const { addFavorite, weather, errorMessage, location, favorites } =
    useContext(UserContext)

  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    if (location && favorites && favorites.length > 0) {
      // Check if the location is already in favorites
      const exists = favorites.some(
        (fav) =>
          (fav.address &&
            location.address &&
            fav.address === location.address) ||
          (fav.city &&
            fav.state &&
            location.city &&
            location.state &&
            fav.city === location.city &&
            fav.state === location.state) ||
          (fav.latitude &&
            fav.longitude &&
            location.latitude &&
            location.longitude &&
            fav.latitude === location.latitude &&
            fav.longitude === location.longitude)
      )
      setIsFavorite(exists)
    } else {
      setIsFavorite(false)
    }
  }, [location, favorites])

  if (!weather) return null

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  const maxFavorites = 10
  const tempFahrenheit = (temp) => ((temp - 273.15) * 1.8 + 32).toFixed(2)

  return (
    <div className="weather-display">
      <h1> Weather in {weather.name}</h1>
      <div className="weather-info">
        <div className="weather-main">
          <img src={iconUrl} alt={weather.weather[0].description} />
          <p>
            {weather.weather[0].main} ({weather.weather[0].description})
          </p>
        </div>
        <div className="weather-details">
          <p>Temperature: {tempFahrenheit(weather.main.temp)}°F</p>
          <p>Feels Like: {tempFahrenheit(weather.main.feels_like)}°F</p>
          <p>Min Temperature: {tempFahrenheit(weather.main.temp_min)}°F</p>
          <p>Max Temperature: {tempFahrenheit(weather.main.temp_max)}°F</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Pressure: {weather.main.pressure} hPa</p>
          <p>Wind Speed: {weather.wind.speed} m/s</p>
          <p>Wind Direction: {weather.wind.deg}°</p>
          <p>Cloudiness: {weather.clouds.all}%</p>
          <p>
            Sunrise: {new Date(weather.sys.sunrise * 1000).toLocaleTimeString()}
          </p>
          <p>
            Sunset: {new Date(weather.sys.sunset * 1000).toLocaleTimeString()}
          </p>
        </div>
      </div>
      {!isFavorite &&
        location.city &&
        location.state &&
        (favorites.length < maxFavorites ? (
          <button onClick={() => addFavorite(location)}>
            Add to Favorites
          </button>
        ) : (
          <p style={{ color: 'red' }}>
            You have reached the maximum number of favorites (10).
          </p>
        ))}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  )
}

export default WeatherDisplay
