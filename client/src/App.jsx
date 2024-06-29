import { useState, useContext } from 'react'
import WeatherDisplay from './components/WeatherDisplay'
import SelectSearchFormat from './components/SelectSearchFormat'
import ListFavorites from './components/ListFavorites'
import GoogleMapsLoader from './components/GoogleMapsLoader'
import { UserProvider, UserContext } from './contexts/UserContext'

function MainApp() {
  const { favorites, weather } = useContext(UserContext)
  const [isMapsLoaded, setIsMapsLoaded] = useState(false)

  const handleGoogleMapsLoad = () => {
    setIsMapsLoaded(true)
  }

  return (
    <UserProvider>
      <div>
        <GoogleMapsLoader onLoad={handleGoogleMapsLoad} />
        {isMapsLoaded && <SelectSearchFormat />}
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
