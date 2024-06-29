/* eslint-disable react/prop-types */
import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

function WeatherDisplay({ weather }) {
  const { addFavorite, location } = useContext(UserContext)

  return (
    <div>
      <h1> Weather in {weather?.name}</h1>
      <p>Temperature: {weather?.main?.temp} Celsius</p>
      <p>Conditions: {weather?.weather[0].description}</p>
      <button onClick={() => addFavorite(location)}>Add to Favorites</button>
    </div>
  )
}

export default WeatherDisplay
