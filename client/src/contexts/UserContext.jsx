import { createContext, useState, useEffect } from 'react'

import axios from 'axios'

const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [weather, setWeather] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [location, setLocation] = useState({
    address: '',
    city: '',
    state: '',
  })

  useEffect(() => {
    fetchUser()
  }, [])
  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/user')
      setUser(response.data)
      setFavorites(response.data.favorites)
      setCurrentLocation(response.data.currentLocation)

      //REMEMBER TO UNCOMMENT THIS
      // if (response.data.currentLocation) {
      //   const weatherData = await getWeather(response.data.currentLocation)
      //   setWeather(weatherData)
      // }
    } catch (error) {
      console.error(error)
    }
  }

  const updateUserLocation = async (location) => {
    try {
      const response = await axios.put('/api/user/location', { location })

      setUser((prevState) => ({
        ...prevState,
        currentLocation: response.data,
      }))

      setCurrentLocation(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const addFavorite = async (location) => {
    try {
      const response = await axios.post('/api/user/favorites', { location })
      setFavorites(response.data.favorites)
      setUser((prevState) => ({
        ...prevState,
        favorites: response.data.favorites,
      }))
    } catch (error) {
      console.error(error)
    }
  }

  const getWeather = async (location) => {
    try {
      const response = await axios.get('/api/weather', {
        params: {
          location,
        },
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        location,
        setLocation,
        favorites,
        weather,
        currentLocation,
        setWeather,
        updateUserLocation,
        addFavorite,
        getWeather,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }
