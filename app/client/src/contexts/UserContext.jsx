import { createContext, useState, useEffect } from 'react'

import axios from 'axios'

const UserContext = createContext()

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [favorites, setFavorites] = useState([])
  const [weather, setWeather] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)
  const [errorMessage, setErrorMessage] = useState({
    message: '',
    function: '',
  })
  const [location, setLocation] = useState({
    address: '',
    city: '',
    state: '',
  })

  useEffect(() => {
    fetchUser()
  }, [])

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage({ message: '', function: '' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [errorMessage])

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/user')
      setUser(response.data)
      setFavorites(response.data.favorites)
      setCurrentLocation(response.data.currentLocation)

      //REMEMBER TO UNCOMMENT THIS
      if (response.data.currentLocation) {
        const weatherData = await getWeather(response.data.currentLocation)
        setWeather(weatherData.data)
      }
    } catch (error) {
      console.error(error)
      setErrorMessage({
        message: error.response ? error.response.data.message : error.message,
        function: 'fetchUser',
      })
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
      setErrorMessage({
        message: error.response ? error.response.data.message : error.message,
        function: 'updateUserLocation',
      })
    }
  }

  const addFavorite = async (location) => {
    try {
      const exists =
        favorites &&
        favorites.length > 0 &&
        favorites.some(
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

      if (exists) {
        setErrorMessage({
          message: 'Location is already in favorites.',
          function: 'addFavorite',
        })
        return
      }
      const response = await axios.post('/api/user/favorites', { location })
      setFavorites(response.data)
      setUser((prevState) => ({
        ...prevState,
        favorites: response.data,
      }))

      return response.data
    } catch (error) {
      console.error(error)
      setErrorMessage({
        message: error.response ? error.response.data.message : error.message,
        function: 'addFavorite',
      })
    }
  }

  const deleteFavorite = async (location) => {
    try {
      const response = await axios.delete('/api/user/favorites', {
        data: { location },
      })
      setFavorites(response.data)
      setUser((prevState) => ({
        ...prevState,
        favorites: response.data,
      }))
    } catch (error) {
      console.error(error)
      setErrorMessage({
        message: error.response ? error.response.data.message : error.message,
        function: 'deleteFavorite',
      })
    }
  }

  const getWeather = async (location) => {
    try {
      const response = await axios.get('/api/weather', {
        params: {
          location,
        },
      })
      setWeather(response.data)
      return { success: true, data: response.data }
    } catch (error) {
      console.error(error)
      setErrorMessage({
        message: error.response ? error.response.data.message : error.message,
        function: 'getWeather',
      })
      return { success: false, error }
    }
  }

  return (
    <UserContext.Provider
      value={{
        user,
        location,
        errorMessage,
        setLocation,
        favorites,
        weather,
        currentLocation,
        setWeather,
        updateUserLocation,
        addFavorite,
        deleteFavorite,
        getWeather,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export { UserContext, UserProvider }
