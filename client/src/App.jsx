import { useState, useContext } from 'react'
import WeatherDisplay from './components/WeatherDisplay'
import SelectSearchFormat from './components/SelectSearchFormat'
import ListFavorites from './components/ListFavorites'
import GoogleMapsLoader from './components/GoogleMapsLoader'
import { UserProvider } from './contexts/UserContext'

function MainApp() {
  const [isMapsLoaded, setIsMapsLoaded] = useState(false)

  const handleGoogleMapsLoad = () => {
    setIsMapsLoaded(true)
  }

  return (
    <UserProvider>
      <div>
        <GoogleMapsLoader onLoad={handleGoogleMapsLoad} />
        <WeatherDisplay />
        {isMapsLoaded && <SelectSearchFormat />}
        <ListFavorites />
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
