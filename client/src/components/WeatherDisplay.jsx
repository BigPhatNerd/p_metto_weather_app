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
  return (
    <div>
      <h1> Weather in {weather?.name}</h1>
      <p>Temperature: {weather?.main?.temp} Celsius</p>
      <p>Conditions: {weather?.weather[0].description}</p>
      {!isFavorite && location.city && location.state && (
        <button onClick={() => addFavorite(location)}>Add to Favorites</button>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  )
}

export default WeatherDisplay
