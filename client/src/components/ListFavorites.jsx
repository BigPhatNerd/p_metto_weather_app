import { useContext } from 'react'
import { UserContext } from '../contexts/UserContext'

function ListFavorites() {
  const { favorites, getWeather, setWeather } = useContext(UserContext)

  const handleFavoriteClick = async (fav) => {
    try {
      const weatherData = await getWeather(fav)
      setWeather(weatherData)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      <h3>Favorites</h3>
      <ul>
        {favorites &&
          favorites.map((fav, index) => {
            if (fav.address) {
              return (
                <li key={index} onClick={() => handleFavoriteClick(fav)}>
                  {fav.address}
                </li>
              )
            } else if (fav.city && fav.state) {
              return (
                <li key={index} onClick={() => handleFavoriteClick(fav)}>
                  {fav.city}, {fav.state}
                </li>
              )
            }
          })}
      </ul>
    </div>
  )
}

export default ListFavorites
