import { useContext, useState } from 'react'
import { UserContext } from '../contexts/UserContext'

function ListFavorites() {
  const { favorites, getWeather } = useContext(UserContext)
  const [errorMessage, setErrorMessage] = useState('')

  const handleFavoriteClick = async (fav) => {
    try {
      await getWeather(fav)
      setErrorMessage('')
    } catch (error) {
      setErrorMessage(
        error.response ? error.response.data.message : error.message
      )
      setTimeout(() => setErrorMessage(''), 3000)
      console.error(error)
    }
  }
  return (
    <div>
      <h3>Favorites</h3>
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <ul>
        {favorites.length > 0 &&
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
