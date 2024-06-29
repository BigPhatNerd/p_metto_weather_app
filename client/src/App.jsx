import { useState, useContext } from 'react'
import WeatherDisplay from './components/WeatherDisplay'
import SelectSearchFormat from './components/SelectSearchFormat'
import ListFavorites from './components/ListFavorites'
import GoogleMapsLoader from './components/GoogleMapsLoader'
import { UserProvider, UserContext } from './contexts/UserContext'

function MainApp() {
  const {
    user,
    favorites,
    weather,
    setWeather,
    addFavorite,
    getWeather,
    updateUserLocation,
  } = useContext(UserContext)
  const [isMapsLoaded, setIsMapsLoaded] = useState(false)

  const handleGetWeather = async (location) => {
    try {
      const weatherData = await getWeather(location)
      setWeather(weatherData)
    } catch (error) {
      console.error(error)
    }
  }

  const handleGoogleMapsLoad = () => {
    setIsMapsLoaded(true)
  }
  console.log({ isMapsLoaded })
  return (
    <UserProvider>
      <div>
        <GoogleMapsLoader onLoad={handleGoogleMapsLoad} />
        {isMapsLoaded && <SelectSearchFormat onSubmit={handleGetWeather} />}
        {weather && <WeatherDisplay weather={weather} />}
        {favorites.length > 0 && <ListFavorites />}
      </div>
    </UserProvider>
  )
}

function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  )
}

export default App
